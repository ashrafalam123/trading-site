import express from "express"
import cors from "cors";
import { orderRouter } from "./routes/order";
import { tradesRouter } from "./routes/trades";
import { depthRouter } from "./routes/depth";
import { klineRouter } from "./routes/kline";
import { tickersRouter } from "./routes/ticker";

const app = express()
app.use(cors());
app.use(express.json());
const port = 3000;

app.use("/api/v1/order", orderRouter)
app.use("/api/v1/trade", tradesRouter)
app.use("/api/v1/depth", depthRouter)
app.use("/api/v1/kline", klineRouter)
app.use("/api/v1/ticker", tickersRouter)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})