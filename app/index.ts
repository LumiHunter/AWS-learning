import dotenv from "dotenv"    // 가장 상위에 환경변수 선언해줘야 함
dotenv.config();
import * as redis from "redis"
import { createApp } from "./app";

const { PORT, REDIS_URL } = process.env

if (!PORT) throw new Error("PORT is required")
if (!REDIS_URL) throw new Error("REDIS_URL is required")

const startServer = async () => {
    console.log("trying to start server")
    const client = redis.createClient({ url: REDIS_URL });    // client는 redis
    await client.connect();    // redis와 express app을 연결.

    const app = createApp(client);
    app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`)
    });

};

startServer();