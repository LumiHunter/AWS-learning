import request from "supertest"
import { createApp, LIST_KEY, RedisClient } from "./app";
import * as redis from "redis"

let app: Express.Application;
let client: RedisClient

const REDIS_URL = "redis://localhost:6379";

beforeAll(async () => {
    client = redis.createClient({ url: REDIS_URL });
    await client.connect();
    app = createApp(client);
})    // 테스트를 실행하기 전에 앱을 먼저 실행시키기

beforeEach(async () => {
    await client.flushDb()
})    // 각 테스트를 실행하기 전에 DB(redis)를 초기화하기

afterAll(async () => {
    await client.flushDb();
    await client.quit();
})
describe("POST /messages", () => {
    it("responds with a success message", async () => {
        const response = await request(app)
            .post("/messages")
            .send({ message: "testing with redis" });

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Message added to list");
    });
});

describe("GET /messages", () => {
    it("responds with all messages", async () => {
        await client.lPush(LIST_KEY, ["msg1", "msg2"])
        const response = await request(app).get("/messages");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(["msg2", "msg1"]);    // 순서는 거꾸로!
    })
})