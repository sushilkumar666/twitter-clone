import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
export const Register = async (req, res) => {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required.", success: false });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists.", success: false });
        }
        const hashedPassword = await bcryptjs.hash(password, 16);
        await User.create({ name, username, email, password: hashedPassword });
        res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Login User
export const Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required.", success: false });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return res.status(401).json({ message: "Incorrect email or password.", success: false });
        }
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
        res.status(200).cookie("token", token, { httpOnly: true, maxAge: 86400000 }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Logout User
export const Logout = (req, res) => {
    res.cookie("token", "", { expires: new Date(0) }).json({ message: "User logged out successfully.", success: true });
};

// Bookmark/Unbookmark Tweet
export const Bookmark = async (req, res) => {
    const { id: userId } = req.body;
    const { id: tweetId } = req.params;
    try {
        const user = await User.findById(userId);
        const updateAction = user.bookmarks.includes(tweetId) ? "$pull" : "$push";
        await User.findByIdAndUpdate(userId, { [updateAction]: { bookmarks: tweetId } });
        res.status(200).json({ message: updateAction === "$pull" ? "Removed from bookmarks." : "Saved to bookmarks." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Get User Profile
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Get Other Users
export const getOtherUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select("-password");
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Follow User
export const Follow = async (req, res) => {
    const { id: loggedInUserId } = req.body;
    const { id: userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (user.followers.includes(loggedInUserId)) {
            return res.status(400).json({ message: `User already followed to ${user.name}` });
        }
        await user.updateOne({ $push: { followers: loggedInUserId } });
        await User.findByIdAndUpdate(loggedInUserId, { $push: { following: userId } });
        res.status(200).json({ message: `You followed ${user.name}`, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Unfollow User
export const Unfollow = async (req, res) => {
    const { id: loggedInUserId } = req.body;
    const { id: userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user.followers.includes(loggedInUserId)) {
            return res.status(400).json({ message: "User has not followed yet." });
        }
        await user.updateOne({ $pull: { followers: loggedInUserId } });
        await User.findByIdAndUpdate(loggedInUserId, { $pull: { following: userId } });
        res.status(200).json({ message: `You unfollowed ${user.name}`, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};
