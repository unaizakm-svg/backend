require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 👍");
});

async function run() {
  try {
    await client.connect();
    console.log("MongoDB Connected ✔️");

    const db = client.db("textileDB");
    const products = db.collection("products");
    const users = db.collection("users");

    // ADD PRODUCT
    app.post("/add-product", async (req, res) => {
      const result = await products.insertOne(req.body);
      res.send(result);
    });

    // GET PRODUCTS
    app.get("/products", async (req, res) => {
      const result = await products.find().toArray();
      res.send(result);
    });

    // SIGNUP
    app.post("/signup", async (req, res) => {
      const userData = req.body;

      const existingUser = await users.findOne({ email: userData.email });

      if (existingUser) {
        return res.send({ message: "User already exists" });
      }

      const result = await users.insertOne(userData);

      res.send({
        message: "Signup successful ✔️",
        result
      });
    });

    // LOGIN
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      const user = await users.findOne({ email });

      if (!user) {
        return res.send({ message: "User not found" });
      }

      if (user.password !== password) {
        return res.send({ message: "Wrong password" });
      }

      res.send({
        message: "Login successful",
        user
      });
    });

  } catch (err) {
    console.log(err);
  }
}

run();

module.exports = app;