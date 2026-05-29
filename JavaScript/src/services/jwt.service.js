import logger from '../middleware/logger.js';
import Jwt from 'jsonwebtoken';
const jwt = Jwt;

export const SECRET_KEY = "586E3272357538782F413F4428472B4B6250655368566B597033733676397924";

export async function generateToken(user) {
    const token = jwt.sign({user}, SECRET_KEY );
    return token;
}

export function ensureToken(req, res, next) {
    const baererHeader = req.header('Authorization');
    if (typeof baererHeader !== 'undefined') {
        const bearer = baererHeader.split(" ");
        const baererToken = bearer[1];
        if (!baererToken) {
            return res.status(401).json({ message: "Token not provied" });
        }
        req.token = baererToken;
        next();
    } else {
        return res.status(403).json({ message: "Token not valid" });
    }
}


function verifyToken(req, res, next) {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provied" });
  }
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.username = payload.username;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}


export default { generateToken, ensureToken, SECRET_KEY, verifyToken };