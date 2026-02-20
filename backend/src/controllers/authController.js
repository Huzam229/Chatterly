import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signUp(req, res) {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters " });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a different one" });
    }

    const seed = Math.random().toString(36).substring(7);
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    // Create a user in Stream as well

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream User Created for this ${newUser.fullName}`);
    } catch (error) {
      console.log("Error in creating stream user: ", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attack
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res
      .status(201)
      .json({ message: "User Created Successfully", success: true, newUser });
  } catch (error) {
    console.log("Error in SignUp: ", error);
    res.status(500).json({ message: "Internal Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters " });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attack
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res
      .status(200)
      .json({ message: "User Login Successfully", success: true, user });
  } catch (error) {
    console.log("Error while login:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout SuccessFull", success: true });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarding: true,
      },
      { new: true },
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // updaet the user in Strean
    try {
      await upsertStreamUser({
        id: updateUser._id.toString(),
        name: updateUser.fullName,
        image: updateUser.profilePic || "",
      });
      console.log(
        `Stream User updated after onboarding for ${updateUser.fullName}`,
      );
    } catch (streamError) {
      console.log("Error in updated after onboarding", streamError.message);
    }
    res
      .status(200)
      .json({ message: "User Updated", success: true, updateUser });
  } catch (error) {
    console.log.og("Error in onBoarding: ", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
