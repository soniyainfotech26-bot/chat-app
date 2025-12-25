const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const User = require("../models/User");
const bcrypt = require('bcryptjs');


router.post("/guest", (req, res) => {
  const guest = {
    id: crypto.randomUUID(),
    role: "guest",
    name: "Guest-" + Math.floor(Math.random() * 1000)
  };
  const token = jwt.sign(guest, "SECRET", { expiresIn: "1h" });
 res.json({ "token":token,"senderId":guest.name });
});


router.post("/signup", async (req, res) => {
  const { email, password ,username} = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "User already exists" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed,username:username,type:"user" });
  res.json({ msg: "User created" });
});



router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ msg: "Invalid user" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ msg: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: "user", email: user.email },
    "SECRET",
    { expiresIn: "1h" }
  );

  res.json({ "token":token,"senderId":user.username });
});


module.exports = router;
