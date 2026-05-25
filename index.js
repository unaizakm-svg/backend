require("dotenv").config();
console.log("ALL ENV:", process.env);

const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());


// TEST ROUTE
app.post("/login", (req, res) => {
  res.send("LOGIN ROUTE WORKING ✔️");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");

  app.get("/login", (req, res) => {
  res.send("Login page open ✔️");
});
});

// ✅ ONLY ONCE
const uri = process.env.MONGO_URI;
console.log("URI:", uri);

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("MongoDB Connected ✔️");

    const db = client.db("textileDB");
    const products = db.collection("products");

    app.get("/", (req, res) => {
      res.send("Server is running 🚀");
    });

    app.post("/add-product", async (req, res) => {
      const result = await products.insertOne(req.body);
      res.send(result);
    });

    // Get all products
app.get("/products", async (req, res) => {
  const result = await products.find().toArray();
  res.send(result);
  const users = db.collection("users");


  // User Signup
app.post("/signup", async (req, res) => {
     res.send("login route working");
  const userData = req.body;
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


  // Check if email already exists
  const existingUser = await users.findOne({ email: userData.email });

  if (existingUser) {
    return res.send({ message: "User already exists" });
  }

  // Save new user
  const result = await users.insertOne(userData);

  res.send({
    message: "Signup successful ✔️",
    result
  });
});
});

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });

  } catch (err) {
    console.log("Error:", err);
  }
}

run();