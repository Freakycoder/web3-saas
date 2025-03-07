"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalanceSchema = exports.updateBalanceSchema = exports.submissionSchema = exports.taskSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.taskSchema = zod_1.default.object({
    user_id: zod_1.default.string(),
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    options: zod_1.default.array(zod_1.default.object({ image_url: zod_1.default.string() })).min(2),
    amount: zod_1.default.number(),
    done: zod_1.default.boolean(),
    signature: zod_1.default.string(),
    task_deadline_time: zod_1.default.number()
});
exports.submissionSchema = zod_1.default.object({
    task_id: zod_1.default.string(),
    selection: zod_1.default.number()
});
exports.updateBalanceSchema = zod_1.default.object({
    locked_amount: zod_1.default.number()
});
exports.getBalanceSchema = zod_1.default.object({
    locked_amount: zod_1.default.number(),
    pending_amount: zod_1.default.number()
});
