import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const fetchUser = async (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      error: "Please authenticate."
    });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);

    if (!data) {
      return res.status(401).send({
        error: "Please authenticate using a valid token"
      });
    }

    req.user = data;
    next();
  } catch (err) {
    return res.status(401).send({
      error: "Please authenticate using a valid token"
    });
  }
};

export default fetchUser;