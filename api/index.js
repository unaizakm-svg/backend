require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

app.get("/", (req, res) => {
  res.send("Backend is running 👍");
});

app.post("/contact", async (req, res) => {

  try {

    await client.connect();

    const db = client.db("textileDB");

    const contacts = db.collection("contacts");

    await contacts.insertOne({

      name: req.body.name,

      email: req.body.email,

      message: req.body.message

    });

    res.send("Feedback submitted successfully ✔️");

  }

  catch (err) {

    console.log(err);

    res.send("Error saving data");

  }

});

module.exports = app;