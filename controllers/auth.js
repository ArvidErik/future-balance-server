import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

export const getUsers = async (req, res) => {
  try {
    const result = await User.findOne({ email: req.user.email });
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Encrypting password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = { name, password: hashedPassword, email };
    const result = await User.create(user);
    res.status(200).json({ result, message: "SUCCESS" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Encrypting password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = { name, password: hashedPassword, email };
    const result = await User.create(user);
    res.status(200).json({ result, message: "SUCCESS" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide username and password." });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    const passwordCorrect = await bcrypt.compareSync(
      password,
      user.password
    );
    if (passwordCorrect) {
      const { _id, email } = user;

      const payload = { _id, email };

      const authToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "2h",
      });
      res.status(200).json({auth: true, authToken: authToken, name: user.name, id: user._id });
    } else {
      res.status(401).json({ message: "Unable to authenticate the user" });
    }
  } catch (err) {
    console.log(err);
  }
};

export const isUserAuth = async (req, res) => {
  res.send(`You are authenticated congrats`)
}

export const getCurrentUser = async (req, res) => {
  try{
    const user = await User.findById(req.userId)
    res.send( {username: user.name, userId: user._id} )
  }catch (err){
    res.send(err)
  }
}