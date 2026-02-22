import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    
    try {
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
        
        if(!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }

        if(password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            })
        }

        const existingUserByEmail = await User.findOne({email: email});
        if(existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

export const login = async (req, res) => {
    
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        
        let user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        // generate token and store in cookies
        const token = await jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"})
        return res.status(200).cookie("token",token, {maxAge: 1*24*60*60*1000, httpOnly: true, secure: true, sameSite: "None"}).json({
            success: true,
            message: `Welcome back ${user.firstName}`,
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}

export const logout = async (req, res) => {
    
    try {
        return res.status(200).cookie("token","",{
        maxAge: 0, httpOnly: true, secure: true, sameSite: "None"}).json({
            success: true,
            message: "Logout successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        })
    }
}

export const updateProfile = async(req, res) => {
    try {
        const userId = req.id;
        const {firstName, lastName, occupation, bio, instagram, facebook, linkedin, github} = req.body;
        const file = req.file;

        const user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        //updating data
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (occupation !== undefined) user.occupation = occupation;
        if (instagram !== undefined) user.instagram = instagram;
        if (facebook !== undefined) user.facebook = facebook;
        if (linkedin !== undefined) user.linkedin = linkedin;
        if (github !== undefined) user.github = github;
        if (bio !== undefined) user.bio = bio;

        if(file) {
            const fileUri = getDataUri(file)
            let cloudResponse = await cloudinary.uploader.upload(fileUri)
            //console.log(cloudResponse)
            user.photoUrl = cloudResponse.secure_url
        }
        
        await user.save()
        return res.status(200).json({
                message: "profile updated successfully",
                success: true,
                user
            })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // exclude password filed
        res.status(200).json({
            success: true,
            message: "user list fetched successfully",
            total: users.length,
            users
        })

    } catch (error) {
        console.error("Error fetching user List:", error)
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        })
    }
}