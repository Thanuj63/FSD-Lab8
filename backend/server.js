const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const SECRET = "secret123";
app.post("/login", (req, res) => {
  const { username } = req.body;

  const token = jwt.sign({ username }, SECRET, {
    expiresIn: "15m"
  });

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict"
  });

  res.json({ message: "Login successful" });
});
app.get("/dashboard", (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = jwt.verify(token, SECRET);
    res.json({ message: "Welcome " + user.username });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});
app.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out" });
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});