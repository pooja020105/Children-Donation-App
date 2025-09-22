const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'https://children-donation-app-1.onrender.com',
  credentials: true,
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log(err));

const orgSchema = new mongoose.Schema({
  orgName: String,
  location: String,
  email: String,
  description: String,
  childCount: Number
});

const childSchema = new mongoose.Schema({
  orgName: String,
  fullName: String,
  age: Number,
  birthday: String,
  dream: String,
  interest: String,
  story: String,
  childimg: String
});

const donationSchema = new mongoose.Schema({
  donationType: { type: String, required: true },
  child: { type: String, default: "" },
  contact: { type: String, required: true },
  message: { type: String, default: "" },
  orgEmail: { type: String, required: true }, 
  date: { type: Date, default: Date.now }
});

const Organisation = mongoose.model('Organisation', orgSchema);
const Child = mongoose.model('Child', childSchema);
const Donation = mongoose.model('Donation', donationSchema);

app.get('/organisations', async (req, res) => {
  const orgs = await Organisation.find();
  res.json(orgs);
});

app.post('/organisations', async (req, res) => {
  const newOrg = new Organisation(req.body);
  await newOrg.save();
  res.json(newOrg);
});

app.put('/organisations/:id', async (req, res) => {
  try {
    const updatedOrg = await Organisation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedOrg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/children', upload.single('childimg'), async (req, res) => {
  try {
    const newChild = new Child({
      orgName: req.body.orgName,
      fullName: req.body.fullName,
      age: req.body.age,
      birthday: req.body.birthday,
      dream: req.body.dream,
      interest: req.body.interest,
      story: req.body.story,
      childimg: req.file ? `/uploads/${req.file.filename}` : ''
    });
    await newChild.save();
    res.json(newChild);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/children', async (req, res) => {
  const { orgName } = req.query;
  const children = orgName
    ? await Child.find({ orgName })
    : await Child.find();
  res.json(children);
});

app.put('/children/:id', upload.single('childimg'), async (req, res) => {
  try {
    const updateData = {
      orgName: req.body.orgName,
      fullName: req.body.fullName,
      age: req.body.age,
      birthday: req.body.birthday,
      dream: req.body.dream,
      interest: req.body.interest,
      story: req.body.story,
    };

    if (req.file) {
      updateData.childimg = `/uploads/${req.file.filename}`;
    }

    const updatedChild = await Child.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedChild) return res.status(404).json({ error: "Child not found" });

    res.json(updatedChild);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/children/:id', async (req, res) => {
  try {
    const deletedChild = await Child.findByIdAndDelete(req.params.id);
    if (!deletedChild) return res.status(404).json({ error: "Child not found" });
    res.json({ message: "Child deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/donations', async (req, res) => {
  try {
    const { donationType, child, contact, message, orgEmail } = req.body;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});
    const newDonation = new Donation({
      donationType,
      child,
      contact,
      message,
      orgEmail
    });

    await newDonation.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: orgEmail, 
      subject: `New Donation Received`,
      text: `
Hello,

You have received a new donation.

Donation Type: ${donationType}
Child: ${child || "Not specified"}
Contact: ${contact}
Message: ${message || "No message provided"}

Thank you!
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Donation email error:", error);
        return res.status(500).json({ message: "Donation saved but email failed to send" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).json({ message: "Donation submitted and email sent successfully!" });
      }
    });

  } catch (err) {
    console.error("Donation error:", err);
    res.status(500).json({ message: "Failed to save donation" });
  }
});

app.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donations" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
