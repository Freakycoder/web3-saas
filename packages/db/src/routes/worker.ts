import { PublicKey } from "@solana/web3.js";
import { Router } from "express";
import nacl from "tweetnacl";
import { client } from "../db";
import { secreatKey, workerMiddleware } from "../middleware";
import jwt from "jsonwebtoken"
import { submissionSchema, updateBalanceSchema } from "../types";

export const workerRouter = Router();

workerRouter.post('/signin', async (req, res) => {
    const { publicKey, signature } = req.body;

    const message = new TextEncoder().encode("sign in to mechanical turks");

    const isWorker = nacl.sign.detached.verify(message, new Uint8Array(signature.data), new PublicKey(publicKey).toBuffer());

    if (!isWorker) {
        res.status(403).json({ message: "incorrect signature or you do not own the wallet" });
        return
    }

    const isExisitingWorker = await client.worker.findFirst({
        where: {
            walletAddress: publicKey
        }
    })

    if (!isExisitingWorker) {
        const newWorker = await client.worker.create({
            data: {
                walletAddress: publicKey,
                pending_amount: 0,
                locked_amount: 0
            }
        });

        const token = jwt.sign({ userID: newWorker.id }, secreatKey);
        res.status(200).json({
            message: "new worker created",
            token: token,
            pending_amount: newWorker.pending_amount,
            locked_amount: newWorker.locked_amount
        })
        return
    }

    const token = jwt.sign({ userID: isExisitingWorker.id }, secreatKey);
    res.status(200).json({ token: token })
});

workerRouter.post('/submission', workerMiddleware, async (req, res) => {
    const submission = req.body;
    const parsedData = submissionSchema.safeParse(submission);
    //@ts-ignore
    const worker_id = req.user_id;

    if (!parsedData) {
        res.status(400).json({ message: "invalid submission data" })
        return
    }

    try {
        const submit = await client.submission.create({
            data: {
                worker_id: worker_id,
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

workerRouter.put('/updateBalance', workerMiddleware, (req, res) => {
    const balance = req.body;
    //@ts-ignore
    const worker_id = req.user_id;

    const parsedData = updateBalanceSchema.safeParse(balance);

    if (!parsedData) {
        res.status(403).json({ message: "invalid data" });
        return
    }

    try {

        const updatedBalance = client.worker.update({
            where: {
                id: worker_id
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

workerRouter.get('/balance')