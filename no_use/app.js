const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./mongodbschema");

const templatePath = path.join(__dirname, '../templates/views');
const app = express();

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", templatePath);

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/Sayam';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/sign", (req, res) => {
    res.render("sign");
});

app.get("/admin", async (req, res) => {
    try {
        const users = await User.find();
        res.render("admin", { users });
    } catch (error) {
        console.error("Error while fetching users:", error);
        res.status(500).send("Error while fetching users");
    }
});



app.post("/sign", async (req, res) => {
    try {
        const { name, email, password, roll, section, branch, phone, localAddress, fatherName, motherName, fatherOccupation, motherOccupation, fatherPhoneNo, motherPhoneNo, fatherMailId, motherMailId, parentAddress, class10Percentage, class12Percentage } = req.body;

        const newUser = new User({
            name,
            email,
            password,
            roll,
            section,
            branch,
            phone,
            localAddress,
            fatherName,
            motherName,
            fatherOccupation,
            motherOccupation,
            fatherPhoneNo,
            motherPhoneNo,
            fatherMailId,
            motherMailId,
            parentAddress,
            class10Percentage,
            class12Percentage
        });

        await newUser.save();

        res.render("login", { success: "User created successfully. Please login." });
    } catch (error) {
        console.error('Error while saving user:', error);
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(400).send("Email already exists");
        }
        res.status(500).send("Error while saving user");
    }
});


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).render("login", { error: "User not found" });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).render("login", { error: "Incorrect password" });
        }

        // Redirect to admin page on successful login
        res.redirect("/admin");
    } catch (error) {
        console.error('Error while logging in:', error);
        res.status(500).send("Error while logging in");
    }
});


















app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
