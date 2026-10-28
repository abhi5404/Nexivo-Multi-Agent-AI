import { getAuth } from 'firebase-admin/auth';
import crypto from 'node:crypto';
import '../config/firebase.js';
import User from '../models/user.model.js';
import redis from '../../../shared/redis/redis.js';

export const login = async (req, res) => {
    try {
   const { token } = req.body;
   // Do something with the token, e.g., verify it or use it to authenticate the user
   const decoded = await getAuth().verifyIdToken(token);
   let user = await User.findOne({
    firebaseUid: decoded.uid
   })
   if (!user) {
    user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture
    })
   }
   const sessionId = crypto.randomUUID();

   //Connect to Redis and store the session data
   await redis.set(`session-${sessionId}`, JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
    }), 'EX', 7 * 24 * 60 * 60      
    ); // Store session in Redis for 7 days


   res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
   });
return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      return res.status(500).json({ message: 'Login failed', error: error.message });
    }
}

//for logout 

export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;
        await redis.del(`session-${sessionId}`);
        res.clearCookie('sessionId');
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
}