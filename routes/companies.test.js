process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let testCompany;
let testInvoice;
beforeEach(async () => {
  const company = await db.query(
    `INSERT INTO companies (code, name, description) 
    VALUES ('MSFT', 'Microsoft Corporation', 'The company that created Windows OS') 
    RETURNING code, name`
  );
  const invoice = await db.query(
    `INSERT INTO invoices (comp_code, amt) VALUES ('MSFT', '100') RETURNING id, comp_code, amt`
  );
  testCompany = company.rows[0];
  testInvoice = invoice.rows;
  testCompany.invoices = testInvoice.map((inv) => inv.id);
});

afterEach(async () => {
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM invoices");
});

afterAll(async () => {
  await db.end();
});

describe("GET /companies", () => {
  test("Get a list of companies", async () => {
    const res = await request(app).get("/companies");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      companies: [{ code: "MSFT", name: "Microsoft Corporation" }],
    });
  });
});

describe("GET /companies/:code", () => {
  test("Get a single company", async () => {
    const res = await request(app).get(`/companies/${testCompany.code}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      company: {
        code: testCompany.code,
        name: testCompany.name,
        description: 'The company that created Windows OS',
        invoices: testCompany.invoices,
      },
    });
  });
  test("Get a single company", async () => {
    const res = await request(app).get("/companies/0");
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /companies", () => {
  test("Create a new company", async () => {
    const res = await request(app).post('/companies').send({
      code: "GOOG",
      name: "Google",
      description: "Made popular search engine",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      company: {
        code: "GOOG",
        name: "Google",
        description: "Made popular search engine",
      },
    });
  });
});

describe("PUT /companies/:code", () => {
  test("Updates a company", async () => {
    const res = await request(app).put(`/companies/${testCompany.code}`).send({
      name: "Microsoft",
      description: "The company that made VSCode",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      company: {
        code: testCompany.code,
        name: "Microsoft",
        description: "The company that made VSCode",
      },
    });
  });
});

describe("DELETE /companies/:code", () => {
  test("DELETE a single company", async () => {
    const res = await request(app).delete(`/companies/${testCompany.code}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg : `Deleted ${testCompany.code}!`});
  });
  test("Fail to DELETE a single company", async () => {
    const res = await request(app).get("/companies/0");
    expect(res.statusCode).toBe(404);
  });
});
