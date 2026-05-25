require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


/* MIDDLEWARE */

app.use(cors());
app.use(express.json());


/* MONGODB CONNECTION */

mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("MongoDB connected ✔️"))

.catch(err => console.log(err));


/* MODEL */

const Contact = mongoose.model("Contact", {

  name: String,

  email: String,

  message: String

});


/* TEST ROUTE */

app.get("/", (req, res) => {

  res.send("Backend is running 👍");

});


/* CONTACT ROUTE */

app.post("/contact", async (req, res) => {

  try {

    console.log(req.body);

    const data = new Contact({

      name: req.body.name,

      email: req.body.email,

      message: req.body.message

    });

    await data.save();

    res.send("Saved to MongoDB ✔️");

  }

  catch (err) {

    console.log(err);

    res.send("Error saving data");

  }

});
module.exports = app;