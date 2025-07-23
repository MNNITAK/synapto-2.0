import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        google: true ,
      });
    }



    const token = generateToken(user._id);

    res.status(200).json({ 
      token,id:user._id,
       name: user.name,
        email: user.email,
        isAdmin:user.isAdmin
     });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(400).json({ message: "Google Authentication Failed" });
  }
};


