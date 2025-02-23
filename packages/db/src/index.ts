import express from "express";
import cors from "cors"
import { userRouter } from "./routes/user";
import { workerRouter } from "./routes/worker";
import path from "path"
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.json({
        message: "Hey server is running"
    });
});

app.use('/v1/user', userRouter);
app.use('/v1/worker', workerRouter);

app.listen(port, () => {
    console.log(`the server is running at port ${port}`)
});
