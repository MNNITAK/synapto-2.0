import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import crypto from "crypto";
import User from "../models/User.js";
import base64url from "base64url";

// In PasskeyVerifyLogin:
// const authenticator = {
//   credentialID: base64url.toBuffer(user.passkey.credentialID),
//   credentialPublicKey: base64url.toBuffer(user.passkey.credentialPublicKey),
//   counter: user.passkey.counter,
//   transports: user.passkey.transports,
// };
// const verificationResult = await verifyAuthenticationResponse({
//   expectedChallenge: user.challenge,
//   expectedOrigin: 'http://localhost:5173',
//   expectedRPID: 'localhost',
//   authenticator,
//   response: credential,
// });

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

// Generate registration options and store challenge in DB
const Passkey = async (req, res) => {
  try {
    const { userId, userName } = req.body;
    console.log("Received userId:", userId);

    if (!userId || !userName) {
      return res
        .status(400)
        .json({ error: "userId and userName are required" });
    }

    const challengePayload = await generateRegistrationOptions({
      rpID: "localhost",
      rpName: "Synapto",
      attestationType: "none",
      userName: userName,
      timeout: 30_000,
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "preferred",
        residentKey: "preferred", // fixed typo: residentKeyconver -> residentKey
      },
    });

    // Store challenge in user's document
    await User.findByIdAndUpdate(userId, {
      challenge: challengePayload.challenge,
    });

    return res.status(200).json({ options: challengePayload });
  } catch (err) {
    console.error("Error generating registration options:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Verify registration response using challenge from DB
const PasskeyVerify = async (req, res) => {
  try {
    const { userId, cred } = req.body;
    if (!userId || !cred) {
      return res
        .status(400)
        .json({ error: "userId and credential are required" });
    }

    const user = await User.findById(userId);
    if (!user || !user.challenge) {
      return res.status(400).json({ error: "User or challenge not found" });
    }

    const verificationResult = await verifyRegistrationResponse({
      expectedChallenge: user.challenge,
      expectedOrigin: "http://localhost:5173",
      expectedRPID: "localhost",
      response: cred,
    });

    if (!verificationResult.verified) {
      return res.json({ error: "could not verify" });
    }

    const { credential } = verificationResult.registrationInfo;
    const newPasskey = {
      credentialID: base64url.encode(Buffer.from(credential.id)),
      credentialPublicKey: base64url.encode(Buffer.from(credential.publicKey)),
      counter: credential.counter,
      transports: credential.transports,
    };
    await User.findByIdAndUpdate(userId, {
      passkey: newPasskey,
      challenge: null,
    });
    return res.json({ verified: true });
    // const NewPasskey = verificationResult.registrationInfo;
    // Helper function to convert ArrayBuffer to base64

    // Usage

    // const {
    //   credential: {
    //     publicKey: credentialPublicKey,
    //     id: credentialID,
    //     counter,
    //     transports
    //   }
    // } = verificationResult.registrationInfo;
    // const { registrationInfo } = verificationResult;
    // const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo;
    //     const newPasskey = {
    //   // `user` here is from Step 2

    //   // A unique identifier for the credential
    //   id: credential.id,
    //   // The public key bytes, used for subsequent authentication signature verification
    //   publicKey:base64url.encode(credential.publicKey),
    //   // The number of times the authenticator has been used on this site so far
    //   counter: credential.counter,
    //   // How the browser can talk with this credential's authenticator
    //   transports: credential.transports,
    //   // Whether the passkey is single-device or multi-device

    //   // Whether the passkey has been backed up in some way

    // };

    // await User.findByIdAndUpdate(userId, {
    //   passkey: NewPasskey,
    //   challenge: null,
    // });

    return res.json({ verified: true });
  } catch (err) {
    console.error("Error verifying passkey:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Generate authentication options and store challenge in DB
const PasskeyLogin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const opts = await generateAuthenticationOptions({
      rpID: "localhost",
      timeout: 30_000,
      userVerification: "preferred",
    });

    // Store challenge in user's document
    await User.findByIdAndUpdate(userId, { challenge: opts.challenge });

    return res.status(200).json({ options: opts });
  } catch (err) {
    console.error("Error generating authentication options:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Verify authentication response using challenge from DB
const PasskeyVerifyLogin = async (req, res) => {
  try {
    const { userId, credential } = req.body;
    if (!userId || !credential) {
      return res.status(400).json({ error: "userId and credential are required" });
    }
    const user = await User.findById(userId);
    if (!user || !user.challenge || !user.passkey) {
      return res.status(400).json({ error: "User, challenge, or passkey not found" });
    }
    console.log("passkey is", user.passkey);

    const authenticator = {
      credentialID: base64url.toBuffer(user.passkey.credentialID),
      credentialPublicKey: base64url.toBuffer(user.passkey.credentialPublicKey),
      counter: user.passkey.counter,
      transports: user.passkey.transports,
    };

    const verificationResult = await verifyAuthenticationResponse({
      expectedChallenge: user.challenge,
      expectedOrigin: "http://localhost:5173",
      expectedRPID: "localhost",
      response: credential,
      authenticator,
    });

    if (!verificationResult.verified) {
      return res.json({ error: "could not verify" });
    }

    await User.findByIdAndUpdate(userId, { challenge: null });
    return res.json({ verified: true });
  } catch (err) {
    console.error("Error verifying authentication:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { Passkey, PasskeyVerify, PasskeyLogin, PasskeyVerifyLogin };

// import { generateRegistrationOptions } from '@simplewebauthn/server';
// import { verifyRegistrationResponse } from '@simplewebauthn/server';
// import crypto from 'crypto';
// import User from '../models/User.js'; // Adjust the path as necessary

// const challengeStore = {}; // You may want to replace this with a DB or session store in production
// const Id="";
// const name="";
// const cred={
//     Id:"",
//     name:""
// }

// if (!globalThis.crypto) {
//   globalThis.crypto = crypto;
// }

// const Passkey = async (req, res) => {
//   try {

//     const { userId, userName } = req.body;

//     //local variables updated ok.
//     Id= userId;
//     name= userName;
//     cred.Id=Id;
//     cred.name=name;

//     if (!userId || !userName) {
//       return res.status(400).json({ error: 'userId and userName are required' });
//     }

//     const userIDBuffer = Buffer.from(userId, 'utf8');

//     const challengePayload = await generateRegistrationOptions({
//         // rpID: 'localhost',
//         rpID: 'localhost',
//         rpName: 'Synapto',
//         attestationType: 'none',
//         userName: userName,
//         timeout: 30_000,
//         authenticatorSelection: {
//         authenticatorAttachment: 'platform',
//         userVerification: 'preferred',
//         residentKeyconver: 'preferred',
//   },
//     })

//     // await User.findByIdAndUpdate(userId, { challenge: challengePayload.challenge });
//     // console.log("Challenge stored for user:", userId);

//     challengeStore[userId]=challengePayload.challenge;  //locally store.

//     return res.status(200).json({ options: challengePayload });
//   } catch (err) {
//     console.error('Error generating registration options:', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const PasskeyVerify=async(req,res)=>{

//     // const user = userStore[userId]
//     // const challenge = challengeStore[userId]

//     const verificationResult = await verifyRegistrationResponse({
//         expectedChallenge: challengeStore[Id],
//         expectedOrigin: 'http://localhost:5173 || https://localhost:5174',
//         expectedRPID: 'localhost',
//         response: cred,
//     })

//     if (!verificationResult.verified) return res.json({ error: 'could not verify' });

//     await User.findByIdAndUpdate(Id, { passkey: verificationResult.registrationInfo});
//     //reset local variables.
//     Id="";
//     name="";
//     cred.Id="";
//     cred.name="";
//     challengeStore[Id]=null; //clear the challenge store for this user.
//     return res.json({ verified: true })
// }
