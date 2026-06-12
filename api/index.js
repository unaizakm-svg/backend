require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

module.exports = async (req, res) => {

  // 🔥 CORS FIX (IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "https://luxeweave.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔥 preflight handle
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      await client.connect();
      const db = client.db("textileDB");

      await db.collection("contacts").insertOne(req.body);

      return res.status(200).json({
        message: "Saved successfully ✔️"
      });

    } catch (err) {
      console.log(err);

      return res.status(500).json({
        error: "Database error"
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
};