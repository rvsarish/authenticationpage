const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
// Import your collection from the file where you set up MongoDB connection
const collection = require('./config'); // Assuming config.js is in the same directory

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('login');
});

app.get("/signup", (req, res) => {
    res.render('signup');
});

app.post("/signup", async (req, res) => {
    try {
        const existingUser = await collection.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            username: req.body.username,
            password: hashedPassword
        };
        const newUser = await collection.create(userData);
        console.log(newUser);
        res.send("User signed up successfully!");
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).send("Error signing up user.");
    }
});

app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send("Invalid Password");
        }
        res.send("Logged in");
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send("Error logging in user.");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
