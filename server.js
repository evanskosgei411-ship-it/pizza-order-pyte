import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// 1. Get Access Token
async function getAccessToken() {
  const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth = Buffer.from(process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET).toString("base64");

  const response = await axios.get(url, {
    headers: { Authorization: "Basic " + auth }
  });

  return response.data.access_token;
}

// 2. Initiate STK Push
app.post("/pay", async (req, res) => {
  const token = await getAccessToken();

  const payload = {
    BusinessShortCode: process.env.SHORTCODE,
    Password: Buffer.from(
      process.env.SHORTCODE + process.env.PASSKEY + new Date().toISOString().slice(0, 14)
    ).toString("base64"),
    Timestamp: new Date().toISOString().slice(0, 14),
    TransactionType: "CustomerPayBillOnline",
    Amount: req.body.amount,
    PartyA: req.body.phone,
    PartyB: process.env.SHORTCODE,
    PhoneNumber: req.body.phone,
    CallBackURL: process.env.CALLBACK_URL,
    AccountReference: "PizzaByteOrder",
    TransactionDesc: "Pizza Order Payment"
  };

  try {
    const mpesaResponse = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(mpesaResponse.data);
  } catch (err) {
    res.status(500).json(err.response.data || err.message);
  }
});

// 3. Callback endpoint
app.post("/mpesa/callback", (req, res) => {
  console.log("Payment result:", req.body);
  res.json({ status: "received" });
});

// Start server
app.listen(3000, () => console.log("MPesa server running on port 3000"));

































