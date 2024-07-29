const User = require("../models/user.model");

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    return accessToken;
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const data = {
      fullname: req.body.fullname,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };
    const createdUser = await User.create(data);

    res.status(200).json({ Message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email && !username) {
      return res.status(500).json({ Message: "Username or Email is required" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(500).json({ Message: "User does not exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(404).json({ Message: "Invalid Credentials" });
    }

    const accessToken = await generateAccessToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(200).cookie("accessToken", accessToken, options).json({
      Message: "User Logged in Successfully",
      success: true,
      accessToken: accessToken,
      user: loggedInUser,
    });
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .json({ Message: "User logged out" });
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const displayUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
};

module.exports = { register, login, displayUsers, logout, me };
