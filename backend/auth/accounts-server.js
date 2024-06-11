const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://client1.xyz.com", "http://client2.xyz.com"],
    credentials: true,
  })
);

const SECRET_KEY = "your_secret_key";
const users = [
  { id: 1, username: "raheja", password: "raheja@123", client: "client1" },
  { id: 2, username: "sameer", password: "sameer@123", client: "client1" },
  { id: 3, username: "fmx", password: "fmx@123", client: "client2" },
  { id: 4, username: "hello", password: "hello@123", client: "client2" },
];

app.post("/login", (req, res) => {
  const { username, password, client } = req.body;
  const user = users.find(
    (u) =>
      u.username === username && u.password === password && u.client === client
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });

  const domainName = `${user.client}.xyz.com`;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);

  res.cookie(domainName, token, {
    httpOnly: true,
    domain: ".xyz.com",
    path: "/",
    secure: false,
    expires: expirationDate,
  });

  res.send({ message: "User logged in successfully" });
});

const PORT = 3000;
app.listen(PORT, "127.0.0.1", () => {
  console.log("Auth server running on http://accounts.xyz.com");
});
