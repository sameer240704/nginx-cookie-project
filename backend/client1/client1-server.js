const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://accounts.xyz.com", "http://client1.xyz.com"],
    credentials: true,
    preflightContinue: false,
  })
);

const SECRET_KEY = "your_secret_key";
const users = [
  { id: 1, username: "raheja", password: "raheja@123", client: "client1" },
  { id: 2, username: "sameer", password: "sameer@123", client: "client1" },
];

function authenticateToken(req, res, next) {
  const token = req.cookies["client1.xyz.com"];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    const user = users.find((u) => u.id === decoded.id);
    if (!user || user.client !== "client1") {
      return res
        .status(403)
        .send("Access denied. Invalid token for this domain.");
    }

    req.user = decoded;
    next();
  });
}

app.get("/verify-token", (req, res) => {
  const token = req.cookies["client1.xyz.com"];

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ authenticated: false });
    }

    return res.status(200).json({ authenticated: true, user: decoded });
  });
});

app.get("/helpdesk", authenticateToken, (req, res) => {
  res.send("Welcome to Helpdesk module");
});

app.get("/workpermit", authenticateToken, (req, res) => {
  res.send("Welcome to Workpermit module");
});

app.get("/vms", authenticateToken, (req, res) => {
  res.send("Welcome to VMS module");
});

const PORT = 4000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Client server running on http://client1.xyz.com:${PORT}`);
});
