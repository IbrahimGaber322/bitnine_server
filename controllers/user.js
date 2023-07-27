import dotenv from "dotenv";
dotenv.config();
import pool from "../database/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const signUp = async (req, res) => {
  const user = req.body;
  
  try {
    const existingUser = await pool.query(
      `Select * from "User" WHERE "email" = $1`,
      [user.email]
    );

    if (existingUser.rows.length !== 0)
      return res.status(400).json({ message: "This email is already used." });
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const newUser = await pool.query(
      `INSERT INTO "User" ("firstName", "lastName", "email", "password")
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [user.firstName, user.lastName, user.email, hashedPassword]
    );
    console.log(newUser.rows);
    if (newUser.rows.length !== 0) {
      const token = jwt.sign({ email: user.email }, process.env.JWTSECRET, {
        expiresIn: "30d",
      });
      const confirmToken = jwt.sign(
        { email: user.email },
        process.env.JWTSECRET,
        { expiresIn: "5min" }
      );

      const mailOptions = {
        from: EMAIL_USER,
        to: user.email,
        subject: "Confirm your account",
        html: `<p>Hi ${
          user.firstName + " " + user.lastName
        },</p><p>Thank you for signing up to our service. Please click on the link below to confirm your account:</p><a href="${process.env.FRONTENDURL}/confirm/${confirmToken}">Confirm your account</a>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(200).json({
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json("database error");
    console.log(error);
  }
};

export const confirm = async (req, res) => {
  const { token } = req.params;
  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    const email = decodedToken.email;
    await pool.query(
      `UPDATE "User" SET "active" = $1 WHERE "email" = $2`,
      [true, email]
    );

    const user = await pool.query(
      `SELECT * FROM "User" WHERE "email" = $1`,
      [email]
    );
   
    if (!user.rows.active) {
      const newToken = jwt.sign({ email: email }, process.env.JWTSECRET, {
        expiresIn: "30d",
      });
      res.status(200).json({ token: newToken });
    } else {
      res.status(500).json("confirmation failed");
    }
  } catch (error) {
    res.status(500).json("database error");
  }
};

export const signIn = async (req, res) => {
  const user = req.body;

  console.log(user);

  try {
    const existingUser = await pool.query(
      'SELECT * FROM "User" WHERE "email" =$1',
      [user.email]
    );
    if (existingUser.rows.length === 0)
      return res.status(404).json({ message: "No user found" });

    const passwordValidate = await bcrypt.compare(
      user.password,
      existingUser.rows[0].password
    );
    if (!passwordValidate)
      return res.status(400).json({ message: "Password is incorrect." });

    const token = jwt.sign({ email: user.email }, process.env.JWTSECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("database error");
  }
};

export const forgotPassword = async (req, res) => {
  const { userEmail } = req.body;

  try {
    const user = await pool.query('SELECT * FROM "User" WHERE "email" = $1', [
      userEmail,
    ]);
    if (user.rows.length === 0)
      return res.status(400).json({ message: "No user with this email" });

    const { firstName, lastName, email } = user.rows[0];
    const token = jwt.sign({ email: email }, process.env.JWTSECRET, {
      expiresIn: "5min",
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `<p>Hi ${
        firstName + " " + lastName
      }, Please click on the link below to reset your password:</p><a href="${process.env.FRONTENDURL}/resetpassword/${token}">Reset your password</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json("database error");
  }
};

export const resetPassword = async (req, res) => {
  const { password, token } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    const email = decodedToken.email;
    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      'UPDATE "User" SET "password" = $1 , "active" = $2 WHERE "email" = $3',
      [hashedPassword, true, email]
    );

   
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json("database error");
  }
};

export const sendConfirm = async (req, res) => {
  const  {token}  = req.body;
  console.log(token);
  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    const email = decodedToken.email;
    const existingUser = await pool.query(
      `SELECT * FROM "User" WHERE "email" = $1`,
      [email]
    );

    if (existingUser.rows.length === 0)
      return res
        .status(400)
        .json({ message: "No user found with this email." });

    const user = existingUser.rows[0];
    if (user.active)
      return res
        .status(400)
        .json({ message: "User account is already active." });

    const confirmToken = jwt.sign(
      { email: user.email },
      process.env.JWTSECRET,
      { expiresIn: "5min" }
    );

    const mailOptions = {
      from: EMAIL_USER,
      to: user.email,
      subject: "Confirm your account",
      html: `<p>Hi ${
        user.firstName + " " + user.lastName
      },</p><p>Thank you for signing up to our service. Please click on the link below to confirm your account:</p><a href="${process.env.FRONTENDURL}/confirm/${confirmToken}">Confirm your account</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to send activation email." });
      } else {
        console.log("Email sent: " + info.response);
        res
          .status(200)
          .json({ message: "Activation email sent successfully." });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Database error." });
  }
};

export const getUser = async (req, res) => {
  const token = req.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    const email = decodedToken.email;

    const user = await pool.query('SELECT * FROM "User" WHERE "email" = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    const data = user.rows[0];
    return res.status(200).json( data );
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    console.error(error);
    return res.status(500).json({ message: "Database error." });
  }
};
