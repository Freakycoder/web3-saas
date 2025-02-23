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
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerRouter = void 0;
const web3_js_1 = require("@solana/web3.js");
const express_1 = require("express");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
exports.workerRouter = (0, express_1.Router)();
exports.workerRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicKey, signature } = req.body;
    const message = new TextEncoder().encode("sign in to mechanical turks");
    const isWorker = tweetnacl_1.default.sign.detached.verify(message, new Uint8Array(signature.data), new web3_js_1.PublicKey(publicKey).toBuffer());
    if (!isWorker) {
        res.status(403).json({ message: "incorrect signature or you do not own the wallet" });
        return;
    }
    const isExisitingWorker = yield db_1.client.worker.findFirst({
        where: {
            walletAddress: publicKey
        }
    });
    if (!isExisitingWorker) {
        const newWorker = yield db_1.client.worker.create({
            data: {
                walletAddress: publicKey,
                pending_amount: 0,
                locked_amount: 0
            }
        });
        const token = jsonwebtoken_1.default.sign({ userID: newWorker.id }, middleware_1.secreatKey);
        res.status(200).json({
            message: "new worker created",
            token: token,
            pending_amount: newWorker.pending_amount,
            locked_amount: newWorker.locked_amount
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ userID: isExisitingWorker.id }, middleware_1.secreatKey);
    res.status(200).json({ token: token });
}));
exports.workerRouter.post('/submission', middleware_1.workerMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const submission = req.body;
    const parsedData = types_1.submissionSchema.safeParse(submission);
    //@ts-ignore
    const worker_id = req.user_id;
    if (!parsedData) {
        res.status(400).json({ message: "invalid submission data" });
        return;
    }
    try {
        const submit = yield db_1.client.submission.create({
            data: {
                worker_id: worker_id,
                option_id: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.selection,
                task_id: (_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.task_id
            }
        });
        res.status(200).json({ message: `submission done ${submit}` });
    }
    catch (e) {
        res.status(404).json({ message: `submission failed` });
    }
}));
exports.workerRouter.put('/updateBalance', middleware_1.workerMiddleware, (req, res) => {
    var _a;
    const balance = req.body;
    //@ts-ignore
    const worker_id = req.user_id;
    const parsedData = types_1.updateBalanceSchema.safeParse(balance);
    if (!parsedData) {
        res.status(403).json({ message: "invalid data" });
        return;
    }
    try {
        const updatedBalance = db_1.client.worker.update({
            where: {
                id: worker_id
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
exports.workerRouter.get('/balance');
