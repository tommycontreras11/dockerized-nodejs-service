import express from "express";
import config from "./../config/index.js";

const app = express();

app.use(express.json())

app.get("/", (_req, res) => {
  res.status(200).send("Hello, World!");
});

app.post("/secret", (req, res) => {
  const { user, password } = req.body;

  if (user !== config.USERNAME || password !== config.PASSWORD)
    res.status(401).json({ message: "User y/o password incorrect" });

  res.status(200).json({ message: config.SECRET_MESSAGE });
});

app.listen(config.PORT, () => {
  console.log(`The server is running on port ${config.PORT}`);
});
