import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const user = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (token) {
      jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
        if (err) {
          res.status(403).json("Unauthinticated");
        } else {
          req.token = token;
          next();
        }
      });
    } else {
      res.status(403).json("Unauthinticated");
    }
  } catch (error) {
    console.log(error);
  }
};

export default user;
