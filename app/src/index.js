import express from "express";
import config from "./../config/index.js";

const app = express();

app.use(express.json())

app.get("/", (_req, res) => {
  res.status(200).send("Hello, World!");
});

app.get("/secret", (req, res) => {
  const auth = req.headers.authorization

  if(!auth?.startsWith("Basic "))
    return res
      .status(401)
      .set("WWW-Authenticate", 'Basic realm="Restricted"')
      .send("Authentication required")

  const encodedCredentials = auth.split(" ")[1]
  const credentials = Buffer.from(encodedCredentials, "base64").toString("utf8")

  const [user, password] = credentials.split(":")

  if (
    user !== config.USERNAME ||
    password !== config.PASSWORD
  ) {
    return res
      .status(401)
      .set("WWW-Authenticate", 'Basic realm="Restricted"')
      .send("Invalid username or password");
  }

  return res.status(200).send(config.SECRET_MESSAGE);
});

app.listen(config.PORT, () => {
  console.log(`The server is running on port ${config.PORT}`);
});
