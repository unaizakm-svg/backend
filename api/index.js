require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors({
  origin: "https://luxeweave-collection.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("textileDB");
  }
  return db;
}

app.get("/", (req, res) => {
  res.send("Backend is running 👍");
});

app.post("/contact", async (req, res) => {
  try {
    const db = await connectDB();
    const contacts = db.collection("contacts");

    await contacts.insertOne(req.body);

    res.send("Feedback submitted successfully ✔️");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving data");
  }
});

module.exports = app;