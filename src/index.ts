import express from "express";
import cors from "cors";

import userRouter from "./userRouter";

const app = express();
const port = process.env.PORT || 8181;

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port} 😳`);
});
