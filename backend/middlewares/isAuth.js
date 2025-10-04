import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';
const handleCurrentUser=async(req,res,next)=>{
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await userModel.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}
export default handleCurrentUser;