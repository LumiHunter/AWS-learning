import express from "express"
import { RedisClientType } from "redis";

export const LIST_KEY = "messages";

export type RedisClient = RedisClientType<any, any, any>;

export const createApp = (client: RedisClient) => {
    const app = express();

    app.use(express.json());

    app.get("/", (request, response) => {
        response.status(200).send("hello from express")
    });

    app.post("/messages", async (request, response) => {
        const { message } = request.body;
        await client.lPush(LIST_KEY, message);    // await여야 하는 이유: redis의 작업이 끝난 후 app이 결과를 받아야 하기 때문!
        response.status(200).send("Message added to list")
    })

    app.get("/messages", async (request, response) => {
        const messages = await client.lRange(LIST_KEY, 0, -1);
        response.status(200).send(messages);
    })

    return app;
};