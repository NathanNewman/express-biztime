This project is a Node JS API. The API contains a database with four tables, companies, invoices, industries, and comp_ind. The API contains get, post, put, and delete routes for each. The invoices table is linked to the companies table in a one to many relationship. The companies and industries tables are linked via the comp_ind table forming a many to many relationship. The API also includes Jest testing for all of the routes.

Jest Commands (in terminal):

jest --runInBand                       (comand for running all tests)
jest companies.test.js                 (comand for testing /companies routes)
jest invoices.test.js                  (comand for testing /invoices routes)
jest industries.test.js                (comand for testing /industries routes)

List of routes

localhost3000/companies (GET)

localhost3000/companies/(code) (GET)

localhost3000/companies (POST) { "code" : "(company)", "name" : "(name)", "description" : "(description)" }

localhost3000/companies/(code) (PUT) { "name" : "(name)", "description" : "(description)" }

localhost3000/companies/(code) (DELETE)

localhost3000/invoices (GET)

localhost3000/invoices/(id) (GET)

localhost3000/invoice (POST) { "comp_code" : "(comp_code)", "amt" : "(amt)" }

localhost3000/invoice/(id) (PUT) { "amt" : "(amt)", "paid" : (boolean) }

localhost3000/invoice/(id) (DELETE)

localhost3000/industries (GET)

localhost3000/industries/(id) (GET)

localhost3000/industries (POST) { "name" : "(name)" }

localhost3000/industries/(id) (PUT) { "name" : "(name)" }

localhost3000/industries/(id) (DELETE)