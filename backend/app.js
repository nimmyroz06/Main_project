const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");  
const User = require("./models/User");
const Quiz = require("./models/quiz");
const HKSUser = require("./models/hksUsers");
const Waste = require("./models/waste");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://nimmyroz:roz206@cluster0.svkepzi.mongodb.net/plastic_waste?retryWrites=true&w=majority&appName=Cluster0");


const JWT_SECRET = "your_jwt_secret"; // Replace with a secure key

// Hardcoded Admin Credentials
const ADMIN_NAME = "nimmy";
const ADMIN_PASSWORD = "admin";


app.post("/signup", async (req, res) => {
  try {
      console.log("Received Data:", req.body);
      const { UserName, email, password, phone, address } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user to database
      const newUser = new User({ UserName, email, password: hashedPassword, phone, address });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Server error" });
  }
});


// User Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = Jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        // Send token and UserName to frontend
        res.status(200).json({ message: "Login successful", token, UserName: user.UserName,email: user.email, phone:user.phone,address: user.address });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Admin Login Route (HARD-CODED)
app.post("/adminlogin", async (req, res) => {
    try {
        const { adminName, password } = req.body;

        if (adminName !== ADMIN_NAME || password !== ADMIN_PASSWORD) {
            return res.status(400).json({ message: "Invalid admin credentials" });
        }

        const token = Jwt.sign({ adminName }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Admin login successful", token, adminName });
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Route to get quiz questions
app.get("/quiz", async (req, res) => {
    try {
        const questions = await Quiz.find();
        // Shuffle questions using Fisher-Yates algorithm
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }

        // Select the first 10 shuffled questions
        const selectedQuestions = questions.slice(0, 10);

        res.json(selectedQuestions);
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Route to add quiz questions
app.post("/api/quiz/add", async (req, res) => {
    try {
        const { question, options, answer } = req.body;

        if (!question || !options || !answer) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newQuestion = new Quiz({ question, options, answer });
        await newQuestion.save();

        res.status(201).json({ message: "Quiz question added successfully" });
    } catch (error) {
        console.error("Error adding quiz question:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ Route to get total number of users
app.get("/admin/users", async (req, res) => {
    try {
        const users = await User.find({}, "UserName email");

        // Get image count per user
        const usersWithImages = await Promise.all(
            users.map(async (user) => {
                return {
                    name: user.UserName,
                    email: user.email,
                };
            })
        );

        res.json(usersWithImages);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ Route to get total recycling centers count
app.get("/admin/recycling-centers", async (req, res) => {
    try {
        const totalCenters = await Bin.countDocuments();
        res.json({ total: totalCenters });
    } catch (error) {
        console.error("Error fetching recycling centers:", error);
        res.status(500).json({ message: "Server error" });
    }
});


const binSchema = new mongoose.Schema({
    name: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
  });
  
  binSchema.index({ location: '2dsphere' }); // Enable geospatial indexing
  const Bin = mongoose.model('Bin', binSchema);
  
  // API to add a recycling bin
  app.post('/add-bin', async (req, res) => {
    try {
      const { name, latitude, longitude } = req.body;
      const newBin = new Bin({
        name,
        location: { type: 'Point', coordinates: [longitude, latitude] },
      });
      await newBin.save();
      res.status(201).send('Bin added successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // API to get nearest bins
  app.get('/nearest-bins', async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      const bins = await Bin.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          },
        },
      });
      res.json(bins);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


app.post("/hks_signup", async (req, res) => {
    try {
        const { name, phoneNumber, password } = req.body;

        // Check if user already exists
        const existingUser = await HKSUser.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: "Phone number already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = new HKSUser({ name, phoneNumber, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Haritha Karma Sena Login
app.post("/hks_login", async (req, res) => {
    const { name, password } = req.body;

    try {
        // Check if user exists
        const user = await HKSUser.findOne({ name });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = Jwt.sign(
            { userId: user._id, name: user.name },
            "your_jwt_secret",
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Route to submit plastic waste data
app.post("/api/waste", async (req, res) => {
    try {
      const { email,username,phone,address, amount } = req.body;
  
      const newWaste = new Waste({
        email,
        username,
        phone,
        address,
        amount,
        status: "Pending",
      });
  
      await newWaste.save();
      res.status(201).json({ message: "Waste data saved successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Route to get all waste data
  app.get("/api/waste", async (req, res) => {
    try {
      const wasteData = await Waste.find();
      res.json(wasteData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Route to update waste collection status
  app.put("/api/waste/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
  
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
  
      // Get current date in IST format (YYYY-MM-DD)
// Function to get current date & time in IST (YYYY-MM-DD HH:MM:SS)
const getISTDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 5); // Convert UTC to IST
  now.setMinutes(now.getMinutes() + 30);
  
  // Format Date: YYYY-MM-DD
  const datePart = now.toISOString().split("T")[0]; 
  
  // Format Time: HH:MM:SS
  const timePart = now.toTimeString().split(" ")[0]; 

  return `${datePart} ${timePart}`; // Combine Date & Time
};

// Prepare update object
const updateData = { status };
if (status === "Collected") {
  updateData.collectedDate = getISTDateTime(); // Store in IST format
} else {
  updateData.collectedDate = null; // Reset if status is changed back
}
  
      const updatedWaste = await Waste.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedWaste) {
        return res.status(404).json({ error: "Waste entry not found" });
      }
  
      res.json(updatedWaste); // Send updated waste data
    } catch (error) {
      console.error("Error updating waste status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
    


  // ✅ API Route to Fetch User Profile
app.get("/api/user/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer token"

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = Jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("UserName email phone address"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});


app.put("/api/user/update", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = Jwt.verify(token, JWT_SECRET);

    // Find the user by ID and update details
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        UserName: req.body.UserName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
      },
      { new: true, select: "UserName email phone address" } // Return updated user info
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.get("/api/user/waste-status", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Fetch waste data for the user, including the collectedDate
    const wasteData = await Waste.find({ email }).select("amount status collectedDate");

    if (!wasteData.length) {
      return res.status(404).json({ message: "No waste data found" });
    }

    res.json(wasteData);
  } catch (error) {
    console.error("Error fetching user waste status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
