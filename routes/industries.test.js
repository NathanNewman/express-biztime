process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let testCompany;
let testInvoice;
let testIndustry;
beforeEach(async () => {
  const company = await db.query(
    `INSERT INTO companies (code, name, description) 
    VALUES ('MSFT', 'Microsoft Corporation', 'The company that created Windows OS') 
    RETURNING code, name`
  );
  const invoice = await db.query(
    `INSERT INTO invoices (comp_code, amt, add_date) VALUES ('MSFT', '100', '2023-01-08') RETURNING id, comp_code, amt, add_date, paid, paid_date`
  );

  const industries = await db.query(`INSERT INTO industries (id, name) VALUES ('1', 'Tech') RETURNING id, name`);
  testCompany = company.rows[0];
  testInvoice = invoice.rows;
  testIndustry = industries.rows;
  testCompany.invoices = testInvoice.map((inv) => inv.id);
  console.log('#######################################################');
  console.log(testIndustry[0]);
});

afterEach(async () => {
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM industries");
  await db.query("DELETE FROM comp_ind");
});

afterAll(async () => {
  await db.end();
});

describe("GET /industries", () => {
    test("GET a list of industries", async () => {
        const res = await request(app).get("/industries");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ industries : testIndustry });
    });
});

describe("GET /industries/:id", () => {
    test("GET one industry", async () => {
        const res = await request(app).get("/industries");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ industry : testIndustry[0] });
    });
});