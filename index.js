require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Wan",
  key: process.env.MAILGUN_KEY,
});

app.use(express.json()).use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome on TripAdvisor" });
});

app.post("/form", async (req, res) => {
  try {
    const { firstname, lastname, email, message } = req.body;

    const messageData = {
      from: `${firstname}` + " " + `${lastname} <${email}>`,
      to: process.env.MAILGUN_USERMAIL,
      subject: "Hello",
      text: message,
    };

    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: "Le site est momentanément indisponible, veuillez ré-essayer",
    });
  }
});

app.all("*", (req, res) => {
  try {
    res.status(404).json({ message: "Page not found" });
  } catch (error) {
    return res.status(500).json({
      message: "Le site est momentanément indisponible, veuillez ré-essayer",
    });
  }
});

PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server has started");
});
