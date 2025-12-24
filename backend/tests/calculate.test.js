const request = require("supertest");
process.env.DB_PATH = "./data/calcflow.test.db";
const app = require("../server");

describe("POST /calculate", () => {
  test("3 + 5 = 8", async () => {
    const res = await request(app)
      .post("/calculate")
      .send({ a: 3, b: 5, operator: "+" });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(8);
  });

  test("division by zero returns 400", async () => {
    const res = await request(app)
      .post("/calculate")
      .send({ a: 3, b: 0, operator: "/" });
    expect(res.statusCode).toBe(400);
  });
});