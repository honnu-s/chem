const express = require("express");
const router = express.Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


router.post("/google-login", async (req, res) => {
  try {
    const { email, name, image } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image,
        provider: "google",
        emailVerified: true,
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ ok: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google login failed" });
  }
});


router.post("/send-magic-link", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expires = Date.now() + 15 * 60 * 1000;

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    user.magicToken = hashedToken;
    user.magicTokenExpires = expires;
    await user.save();

    const magicUrl = `${process.env.FRONTEND_URL}/magic?token=${rawToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Sign in to ChemGuard",
      html: `<a href="${magicUrl}">Click to sign in</a>`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send magic link" });
  }
});


router.post("/verify-magic", async (req, res) => {
  try {
    const { token } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      magicToken: hashedToken,
      magicTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.magicToken = undefined;
    user.magicTokenExpires = undefined;
    user.emailVerified = true;
    await user.save();

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ ok: true, token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;
