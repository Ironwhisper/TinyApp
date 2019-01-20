# TinyApp

This app provides an amazing oportunity for the user to shorten those pesky lengthy urls, full of werid letters and numbers.
Once registered and logged in, the user can input any url address and receive a nice short hyperlink consisting of a uniquely
generated 6 symbol id, which will lead the usr to the desired url.

The user will only be able to see a list of shortened urls that they themselves have created.
They can manipulate their list by updating the existing urls destination address url, or deleting a url from the list altogether.
Others users' data is inaccessible.
User's passwords are securely hashed and stored using bcrypt.

## Dependencies

- Node.js
- Express
- EJS
- Bcrypt
- Body-parser
- Cookie-session

## Getting started

- Install all dependencies using 'npm install' command
- run server using 'node express-server.js' or 'npm start'