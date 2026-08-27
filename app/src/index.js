import express from "express"
import config from "./../config/index.js"

const app = express()

app.get("/", (_req, res) => {
  res.status(200).send("Hello, World!")
})

app.listen((config.PORT), () => {
  console.log(`The server is running on port ${config.PORT}`)  
})