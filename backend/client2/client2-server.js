const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://accounts.xyz.com", "http://client2.xyz.com"],
    credentials: true,
  })
);

const SECRET_KEY = "your_secret_key";
const users = [
  { id: 3, username: "fmx", password: "fmx@123", client: "client2" },
  { id: 4, username: "hello", password: "hello@123", client: "client2" },
];

function authenticateToken(req, res, next) {
  const token = req.cookies["client2.xyz.com"];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    console.log("Decoded: ", decoded.id);
    if (err) {
      return res.status(403).send("Invalid token");
    }

    const user = users.find((u) => u.id === decoded.id);
    if (!user || user.client !== "client2") {
      return res
        .status(403)
        .send("Access denied. Invalid token for this domain.");
    }

    req.user = decoded;
    next();
  });
}

app.get("/helpdesk", authenticateToken, (req, res) => {
  res.send("Welcome to Helpdesk module");
});

app.get("/workpermit", authenticateToken, (req, res) => {
  res.send("Welcome to Workpermit module");
});

app.get("/vms", authenticateToken, (req, res) => {
  res.send("Welcome to VMS module");
});

const PORT = 6000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Client server running on http://client2.xyz.com:${PORT}`);
});
