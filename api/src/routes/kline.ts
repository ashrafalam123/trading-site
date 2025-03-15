import { Router } from "express"
import { RedisManager } from "../RedisManager";
import { Client } from "pg";

export const klineRouter = Router();

const client = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432
})

client.connect();

//@ts-ignore
klineRouter.get("/", async (req, res) => {
    const { market, interval, startTime, endTime } = req.query
    let query
    switch (interval) {
        case '1m':
            query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1h':
            query = `SELECT * FROM klines_1h WHERE  bucket >= $1 AND bucket <= $2`;
            break;
        case '1w':
            query = `SELECT * FROM klines_1w WHERE bucket >= $1 AND bucket <= $2`;
            break;
        default:
            return res.status(400).send('Invalid interval');
    } 

    try {
        //@ts-ignore
        const response = await client.query(query, [new Date(startTime * 1000 as string), new Date(endTime * 1000 as string)])
        res.json(response.rows.map((x) => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.quoteVolume,
            start: x.start,
            trades: x.trades,
            volume: x.volume
        })))
    } catch (e) {
        console.log(e);
        res.status(500).send(e)
    }
})