// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.js";

// const router = express.Router();

// // User SignUp
// router.post("/signup", async (req, res) => {
//     try{
//         const {name, email, password} = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({name, email, password: hashedPassword});
//         await user.save();
//         res.status(201).json({message: "User Created Successfully"});
//     } catch (error) {
//         res.status(500).json({error: "SignUp Failed"});
//     }
// });

// //User Login
// router.post("/login", async (req, res) => {
//     try{
//         const {email, password} = req.body;
//         const user = await User.findOne({email});
//         if (!user || !(await bcrypt.compare(password, user.password))){
//             return res.status(401).json({error: "Invalid Credentails"});
//         }
//         const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET , {expiresIn: "1h"});
//         res.json({token});
//     } catch (error){
//         res.status(500).json({error: "Login Failed"})
//     }
// });

// export default router;




import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// User SignUp
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        res.status(500).json({ error: "SignUp Failed" });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Login Failed" });
    }
});

export default router;
