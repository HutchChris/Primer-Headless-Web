// This example is built using express
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const PORT = process.env.PORT || 80;
const API_KEY = process.env.API_KEY;
const PRIMER_API_URL = process.env.PRIMER_API_URL;
const orderId = "order-CH123." + Math.random();

const app = express();

const staticDir = path.join(__dirname, "static");
const checkoutPage = path.join(__dirname, "static", "checkout.html");
const checkoutConfirmationPage = path.join(__dirname, "static", "checkoutConfirmation.html");


app.use(bodyParser.json());
app.use("/static", express.static(staticDir));

app.get("/", (req, res) => {
  return res.sendFile(checkoutPage);
});

app.get("/", (req, res) => {
  return res.sendFile(checkoutConfirmationPage);
});

app.post("/client-session", async (req, res) => {
  const url = `${PRIMER_API_URL}/client-session`;
  console.log("client session call started");
  const response = await fetch(url, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'X-Api-Key': API_KEY,
      'X-API-VERSION': '2.2',
    },
    body: JSON.stringify({
      amount: 10000,
      currencyCode: "USD",
      orderId: orderId,
      order: {
        countryCode: 'US',
        lineItems: [
          {
            itemId: 'snowboard-123',
            name: 'snowboard ',
            description: 'gnu riders choice',
            amount: 10000,
            quantity: 1
          }
        ]
      },
      metadata: {
        "connection_route": "braintree"
   }
      }),
    });

  const json = await response.json();
  console.log("client session call:" +json);

  return res.send(json);
});


console.log(`Checkout server listening on port ${PORT}.\n\nYou can now view the Checkout in a web browser at http://localhost:${PORT}`);
app.listen(PORT);
