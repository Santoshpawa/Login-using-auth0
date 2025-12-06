import jwt from "jsonwebtoken";
import { userModal } from "../modals/user.modal.js";

export async function authmiddleware(req, res, next) {
  try {
    if (!req.cookies.accessToken) {
      return res.status(200).json({ message: "Login again" });
    }
    let token = req.cookies.accessToken;
    let decodedToken;
   
    if (token) {
      decodedToken = jwt.verify(token, process.env.AccessTokenSecret);
    }else{
      token = req.cookies.refreshToken;
      decodedToken = jwt.verify(token, process.env.refreshTokenSecret);
    }
    
    if (!decodedToken) {
      return res.status(401).json({ message: "User not identified" });
    } 

    
    // let userId = await userModal.findById(decodedToken._id);
    req.userId = decodedToken._id;
    
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong in auth middleware" });
  }
}
