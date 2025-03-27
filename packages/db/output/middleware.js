"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = exports.secreatKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.secreatKey = 'SeCrEaT';
const userMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    const data = jsonwebtoken_1.default.verify(token, exports.secreatKey);
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
