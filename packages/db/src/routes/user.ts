import { Router } from "express";
import { client } from "../db";
import { submissionSchema, taskSchema, updateBalanceSchema } from "../types";
import { userMiddleware } from "../middleware";
import nacl from "tweetnacl"
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import jwt from "jsonwebtoken"
import { secreatKey } from "../middleware";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export const userRouter = Router();

const endpoint = clusterApiUrl("devnet");
const connection = new Connection(endpoint, "confirmed");

const s3client = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.ACCESS_SECRET ?? ''
    },
    region: 'ap-south-1'
})

userRouter.post('/connected', async (req, res) => {
    const { publicKey, signature } = req.body;

    console.log("the publicKey is: ", publicKey);
    console.log("the signature is: ", signature);

    if (!publicKey || !signature) {
        console.log("No publicKey or signature received.");
        res.status(400).json({ message: "No publicKey or signature received" });
        return
    }

    const message = new TextEncoder().encode("Sign into mechanical turks");

    console.log("signed message recieved")
    console.log("processing the message...")

    const isVerified = nacl.sign.detached.verify(message, new Uint8Array(signature.data), new PublicKey(publicKey).toBuffer());

    if (!isVerified) {
        console.log("Signature not valid")
        res.status(403).json({ message: "incorrect signature or you do not own the wallet" });
        return
    }

    console.log("signature verification succesfull")
    console.log("proceeding to check user...")

    const isExisitingUser = await client.user.findFirst({
        where: {
            walletAddress: publicKey
        }
    })

    if (!isExisitingUser) {
        const newUser = await client.user.create({
            data: {
                walletAddress: publicKey
            }
        });
        console.log("old user not exist, creating a new user...")
        const token = jwt.sign({ userID: newUser.id }, secreatKey);
        res.status(200).json({ message: "new user created", token: token })
        return
    }
    console.log("user exist, initializing token.")
    const token = jwt.sign({ userID: isExisitingUser.id }, secreatKey);
    res.status(200).json({ token: token })
})

userRouter.post('/task', userMiddleware, async (req, res) => {
    try {
        const task = req.body;
        //@ts-ignore
        const user_id = req.userID;

        const parsedData = taskSchema.safeParse(task);

        if (!parsedData) {
            res.status(404).json({ message: "invalid data" })
            return
        }
        const taskDeadline = parsedData.data?.task_deadline_time!;

        const response = await client.$transaction(async tx => {

            const newTask = await tx.task.create({
                data: {
                    title: parsedData.data?.title!,
                    description: parsedData.data?.description!,
                    user_id: user_id,
                    done: parsedData.data?.done ?? false,
                    amount: parsedData.data?.amount!,
                    Signature: parsedData.data?.signature!,
                    task_creation_time: new Date(),
                    task_deadline_time: new Date(Date.now() + taskDeadline * 24 * 60 * 60 * 1000) // its basically 7 days from now
                }
            })

            if (parsedData.data?.options) {
                await tx.options.createMany({
                    data: parsedData.data.options.map(x => ({
                        image_url: x.image_url,
                        task_id: newTask.id,
                    }))
                });
            }

            return newTask;
        })

        res.status(200).json({ message: `new task created: ${response.id}` })

    } catch (e) {
        res.status(404).json({ message: "error in creating new task" })
    }
})

userRouter.get('/task', userMiddleware, (req, res) => {
    //@ts-ignore
    const userID = req.userID;

    try {
        const task = client.task.findMany({
            where: {
                user_id: userID
            },
            include: {
                submission: true
            }
        })

        res.status(200).json({
            message: "task retrived succesfully",
            task: task
        })
    } catch (e) {
        res.status(404).json({ message: "error retrieving tasks" })
    }
});

userRouter.post('/submission', userMiddleware, async (req, res) => {
    const submission = req.body;
    const parsedData = submissionSchema.safeParse(submission);
    //@ts-ignore
    const user_id = req.user_id;

    if (!parsedData) {
        res.status(400).json({ message: "invalid submission data" })
        return
    }

    try {
        const submit = await client.submission.create({
            data: {
                user_id: user_id,
                option_id: parsedData.data?.selection!,
                task_id: parsedData.data?.task_id!
            }
        })

        res.status(200).json({ message: `submission done ${submit}` })
    }
    catch (e) {
        res.status(404).json({ message: `submission failed` })
    }
});

userRouter.get('/presignedURLS', async (req, res) => {

    const data = req.params;

    try {
        const { url, fields } = await createPresignedPost(s3client, {
            Bucket: 'data-labelling-saas',
            //@ts-ignore
            Key: `${data.taskID}/${data.filename}.${data.filetype}`,
            Conditions: [
                ['content-length-range', 0, 5 * 1024 * 1024],],
            Expires: 3600
        })

        res.status(200).json({
            message: "url generated succesfully",
            url: url,
            fields: fields
        })
    } catch (e) {
        res.status(404).json({ message: 'url not generated from some reason' });
    }
})

userRouter.post('/confirmation', userMiddleware, async (req, res) => {
    const { signature, amount } = req.body;
    //@ts-ignore
    const user_id = req.user_id;

    try {

        const User = await client.user.findUnique({
            where: {
                id: user_id
            }
        })

        if (!User) {
            res.status(403).json({ message: "wallet doesn't exist, please connect/signIn" })
            return
        }

        const publicKey = User.walletAddress;

        const transaction = await connection.getTransaction(signature, { maxSupportedTransactionVersion: 1 });

        if (!transaction) {
            res.status(403).json({ message: 'transaction signature invalid' });
            return
        }

        if (transaction.transaction.message.getAccountKeys().get(0)?.toString() !== publicKey) {
            res.status(403).json({ message: 'invalid sender address' })
            return
        }

        if (transaction.transaction.message.getAccountKeys().get(1)?.toString() !== process.env.PARENT_ADDRESS) {
            res.status(403).json({ message: 'money not recieved' });
            return
        }

        const postBalances = transaction.meta?.postBalances[1];
        const preBalances = transaction.meta?.preBalances[1];
        const payment = amount * 10 ** 9;

        if (postBalances && preBalances) {
            if (preBalances - postBalances !== payment) {
                res.status(403).json({ message: "insufficient amount sent" })
                return
            }
            else {
                res.status(200).json({ message: 'Amount Recieved' })
                return
            }
        }
    } catch (e) {
        res.status(404).json({ message: 'transaction not confirmed for some reason' })
    }

})

userRouter.put('/updateBalance', userMiddleware, (req, res) => {
    const balance = req.body;
    //@ts-ignore
    const user_id = req.user_id;

    const parsedData = updateBalanceSchema.safeParse(balance);

    if (!parsedData) {
        res.status(403).json({ message: "invalid data" });
        return
    }

    try {

        const updatedBalance = client.user.update({
            where: {
                id: user_id
            },
            data: {
                locked_amount: {
                    decrement: parsedData.data?.locked_amount
                }
            }
        })

        res.status(200).json({
            message: "balance updated succesfully",
            balance: updatedBalance
        })
    } catch (e) {
        res.status(403).json({ message: 'unsuccesfull updation' })
    }
})