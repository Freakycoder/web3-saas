"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerMiddleware = exports.userMiddleware = exports.secreatKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.secreatKey = 'SeCrEaT';
const userMiddleware = (req, res, next) => {
    var _a;
    const authHeader = (_a = req.headers['authorization']) !== null && _a !== void 0 ? _a : '';
    const data = jsonwebtoken_1.default.verify(authHeader, exports.secreatKey);
    if (!data) {
        res.status(400).json({ message: "no wallet address found" });
        return;
    }
    // @ts-ignore
    if (data.userID) {
        //@ts-ignore
        req.userID = data.userID;
        next();
    }
    else {
        res.status(403).json({ message: "please connect wallet" });
        return;
    }
};
exports.userMiddleware = userMiddleware;
const workerMiddleware = (req, res, next) => {
    var _a;
    const authHeader = (_a = req.headers['authorization']) !== null && _a !== void 0 ? _a : '';
    const data = jsonwebtoken_1.default.verify(authHeader, exports.secreatKey);
    if (!data) {
        res.status(400).json({ message: "no wallet address found" });
        return;
    }
    // @ts-ignore
    if (data.userID) {
        //@ts-ignore
        req.userID = data.userID;
        next();
    }
    else {
        res.status(403).json({ message: "please connect wallet" });
        return;
    }
};
exports.workerMiddleware = workerMiddleware;
