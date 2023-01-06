This project is a Node JS API. The API contains a database with two tables, companies and invoices. The API contains get, post, put, and delete routes for each. The companies table includes three columns; code, name, and description. The invoices table includes six columns; id, comp_code, amt, paid, add_date, and paid_date. The routes are below.

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