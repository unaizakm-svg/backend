require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

// ✅ FIX 1: Correct CORS (NO /contact here)
app.use(cors({
  origin: "https://luxeweave.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ FIX 2: Proper preflight handling
app.options("*", cors());

app.use(express.json());

// MongoDB setup
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

// safe DB connection
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("textileDB");
  }
  return db;
}

// health check
app.get("/", (req, res) => {
  res.send("Backend is running 👍");
});

// ✅ FIXED CONTACT ROUTE
app.post("/contact", async (req, res) => {
  try {
    const db = await connectDB();
    const contacts = db.collection("contacts");

    await contacts.insertOne(req.body);

    return res.status(200).json({
      message: "Feedback submitted successfully ✔️"
    });

  } catch (err) {
    console.log("ERROR:", err);

    return res.status(500).json({
      error: "Error saving data"
    });
  }
});

module.exports = app;