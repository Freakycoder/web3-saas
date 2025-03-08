"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const types_1 = require("../types");
const middleware_1 = require("../middleware");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const web3_js_1 = require("@solana/web3.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_2 = require("../middleware");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_presigned_post_1 = require("@aws-sdk/s3-presigned-post");
exports.userRouter = (0, express_1.Router)();
const endpoint = (0, web3_js_1.clusterApiUrl)("devnet");
const connection = new web3_js_1.Connection(endpoint, "confirmed");
const s3client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: (_a = process.env.ACCESS_KEY_ID) !== null && _a !== void 0 ? _a : '',
        secretAccessKey: (_b = process.env.ACCESS_SECRET) !== null && _b !== void 0 ? _b : ''
    },
    region: 'ap-south-1'
});
exports.userRouter.post('/connected', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicKey, signature } = req.body;
    console.log("the publicKey is: ", publicKey);
    console.log("the signature is: ", signature);
    if (!publicKey || !signature) {
        console.log("No publicKey or signature received.");
        res.status(400).json({ message: "No publicKey or signature received" });
        return;
    }
    const message = new TextEncoder().encode("Sign into mechanical turks");
    console.log("signed message recieved");
    console.log("processing the message...");
    const isVerified = tweetnacl_1.default.sign.detached.verify(message, new Uint8Array(signature.data), new web3_js_1.PublicKey(publicKey).toBuffer());
    if (!isVerified) {
        console.log("Signature not valid");
        res.status(403).json({ message: "incorrect signature or you do not own the wallet" });
        return;
    }
    console.log("signature verification succesfull");
    console.log("proceeding to check user...");
    const isExisitingUser = yield db_1.client.user.findFirst({
        where: {
            walletAddress: publicKey
        }
    });
    if (!isExisitingUser) {
        const newUser = yield db_1.client.user.create({
            data: {
                walletAddress: publicKey
            }
        });
        console.log("old user not exist, creating a new user...");
        const token = jsonwebtoken_1.default.sign({ userID: newUser.id }, middleware_2.secreatKey);
        res.status(200).json({ message: "new user created", token: token });
        return;
    }
    console.log("user exist, initializing token.");
    const token = jsonwebtoken_1.default.sign({ userID: isExisitingUser.id }, middleware_2.secreatKey);
    res.status(200).json({ token: token });
}));
exports.userRouter.post('/task', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const task = req.body;
        //@ts-ignore
        const user_id = req.userID;
        const parsedData = types_1.taskSchema.safeParse(task);
        if (!parsedData) {
            res.status(404).json({ message: "invalid data" });
            return;
        }
        const taskDeadline = (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.task_deadline_time;
        const response = yield db_1.client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const newTask = yield tx.task.create({
                data: {
                    title: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.title,
                    description: (_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.description,
                    user_id: user_id,
                    done: (_d = (_c = parsedData.data) === null || _c === void 0 ? void 0 : _c.done) !== null && _d !== void 0 ? _d : false,
                    amount: (_e = parsedData.data) === null || _e === void 0 ? void 0 : _e.amount,
                    Signature: (_f = parsedData.data) === null || _f === void 0 ? void 0 : _f.signature,
                    task_creation_time: new Date(),
                    task_deadline_time: new Date(Date.now() + taskDeadline * 24 * 60 * 60 * 1000) // its basically 7 days from now
                }
            });
            if ((_g = parsedData.data) === null || _g === void 0 ? void 0 : _g.options) {
                yield tx.options.createMany({
                    data: parsedData.data.options.map(x => ({
                        image_url: x.image_url,
                        task_id: newTask.id,
                    }))
                });
            }
            return newTask;
        }));
        res.status(200).json({ message: `new task created: ${response.id}` });
    }
    catch (e) {
        res.status(404).json({ message: "error in creating new task" });
    }
}));
exports.userRouter.get('/task', middleware_1.userMiddleware, (req, res) => {
    //@ts-ignore
    const userID = req.userID;
    try {
        const task = db_1.client.task.findMany({
            where: {
                user_id: userID
            },
            include: {
                submission: true
            }
        });
        res.status(200).json({
            message: "task retrived succesfully",
            task: task
        });
    }
    catch (e) {
        res.status(404).json({ message: "error retrieving tasks" });
    }
});
exports.userRouter.post('/submission', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const submission = req.body;
    const parsedData = types_1.submissionSchema.safeParse(submission);
    //@ts-ignore
    const user_id = req.user_id;
    if (!parsedData) {
        res.status(400).json({ message: "invalid submission data" });
        return;
    }
    try {
        const submit = yield db_1.client.submission.create({
            data: {
                user_id: user_id,
                option_id: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.selection,
                task_id: (_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.task_id,
                submission_date: new Date(),
                completion_time: (_c = parsedData.data) === null || _c === void 0 ? void 0 : _c.completion_time
            }
        });
        res.status(200).json({ message: `submission done ${submit}` });
    }
    catch (e) {
        res.status(404).json({ message: `submission failed` });
    }
}));
exports.userRouter.get('/presignedURLS', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.params;
    try {
        const { url, fields } = yield (0, s3_presigned_post_1.createPresignedPost)(s3client, {
            Bucket: 'data-labelling-saas',
            //@ts-ignore
            Key: `${data.taskID}/${data.filename}.${data.filetype}`,
            Conditions: [
                ['content-length-range', 0, 5 * 1024 * 1024],
            ],
            Expires: 3600
        });
        res.status(200).json({
            message: "url generated succesfully",
            url: url,
            fields: fields
        });
    }
    catch (e) {
        res.status(404).json({ message: 'url not generated from some reason' });
    }
}));
exports.userRouter.post('/confirmation', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { signature, amount } = req.body;
    //@ts-ignore
    const user_id = req.user_id;
    try {
        const User = yield db_1.client.user.findUnique({
            where: {
                id: user_id
            }
        });
        if (!User) {
            res.status(403).json({ message: "wallet doesn't exist, please connect/signIn" });
            return;
        }
        const publicKey = User.walletAddress;
        const transaction = yield connection.getTransaction(signature, { maxSupportedTransactionVersion: 1 });
        if (!transaction) {
            res.status(403).json({ message: 'transaction signature invalid' });
            return;
        }
        if (((_a = transaction.transaction.message.getAccountKeys().get(0)) === null || _a === void 0 ? void 0 : _a.toString()) !== publicKey) {
            res.status(403).json({ message: 'invalid sender address' });
            return;
        }
        if (((_b = transaction.transaction.message.getAccountKeys().get(1)) === null || _b === void 0 ? void 0 : _b.toString()) !== process.env.PARENT_ADDRESS) {
            res.status(403).json({ message: 'money not recieved' });
            return;
        }
        const postBalances = (_c = transaction.meta) === null || _c === void 0 ? void 0 : _c.postBalances[1];
        const preBalances = (_d = transaction.meta) === null || _d === void 0 ? void 0 : _d.preBalances[1];
        const payment = amount * 10 ** 9;
        if (postBalances && preBalances) {
            if (preBalances - postBalances !== payment) {
                res.status(403).json({ message: "insufficient amount sent" });
                return;
            }
            else {
                res.status(200).json({ message: 'Amount Recieved' });
                return;
            }
        }
    }
    catch (e) {
        res.status(404).json({ message: 'transaction not confirmed for some reason' });
    }
}));
exports.userRouter.put('/updateBalance', middleware_1.userMiddleware, (req, res) => {
    var _a;
    const balance = req.body;
    //@ts-ignore
    const user_id = req.user_id;
    const parsedData = types_1.updateBalanceSchema.safeParse(balance);
    if (!parsedData) {
        res.status(403).json({ message: "invalid data" });
        return;
    }
    try {
        const updatedBalance = db_1.client.user.update({
            where: {
                id: user_id
            },
            data: {
                locked_amount: {
                    decrement: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.locked_amount
                }
            }
        });
        res.status(200).json({
            message: "balance updated succesfully",
            balance: updatedBalance
        });
    }
    catch (e) {
        res.status(403).json({ message: 'unsuccesfull updation' });
    }
});
exports.userRouter.post('/manageReputation', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oneWeekago = new Date();
    oneWeekago.setDate(oneWeekago.getDate() - 7);
    //@ts-ignore
    const user_id = req.user_id;
    const userSubmissions = yield db_1.client.submission.findMany({
        where: {
            id: user_id,
            submission_date: {
                gte: oneWeekago
            }
        }
    });
    if (userSubmissions.length >= 3) {
        let correctSubmissionCount = 0;
        let totalSubmissionCount = userSubmissions.length;
        userSubmissions.map((submission) => {
            if (submission.completion_time >= 30) {
                correctSubmissionCount += 1;
            }
        });
        let reputationIncrease = 0;
        let reputationDecrease = (totalSubmissionCount - correctSubmissionCount) * 5;
        if (correctSubmissionCount == 3) {
            reputationIncrease = 10;
        }
        else if (correctSubmissionCount == 5) {
            reputationIncrease = 20;
        }
        else if (correctSubmissionCount > 5) {
            reputationIncrease = 30;
        }
        if (reputationIncrease > 0) {
            yield db_1.client.user.update({
                where: { id: user_id },
                data: {
                    reputation: { increment: reputationIncrease }
                }
            });
            return;
        }
        if (reputationDecrease > 0) {
            yield db_1.client.user.update({
                where: { id: user_id },
                data: {
                    reputation: { decrement: reputationDecrease }
                }
            });
            return;
        }
    } // anything below 3 submissions must not be given any points
    else {
        return;
    }
}));
