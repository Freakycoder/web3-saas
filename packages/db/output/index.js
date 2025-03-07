"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/public', express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.json({
        message: "Hey server is running"
    });
});
app.use('/v1/user', user_1.userRouter);
app.listen(port, () => {
    console.log(`the server is running at port ${port}`);
});
