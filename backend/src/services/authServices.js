import { Counter } from "../models/counterSchema.js";
import { User } from "../models/userSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { decryptPassword } from "../utils/decryptPassword.js";
import { Otp } from "../models/otpSchema.js";
import { transporter } from "../config/sendOtp.js";


class AuthService {

  async registers({name, email, password}){
    try{
        const userExists = await User.findOne({email});
     
        if (userExists && userExists.password !== null) {
            return {success: false, message: 'User already exists.'};
        }
        else if(userExists) {
          const decryptedPassword = decryptPassword(password);

            const pass = await bcrypt.hash(decryptedPassword, 10);
            const user = await User.findOneAndUpdate({email}, {password: pass});

            console.info('New user registers successfully.', { userId: user.userId });
            return {success: true, userId: user.userId, role: user.role, name: user.name };
        }
        const counter = await Counter.findOneAndUpdate(
        { name: "userId" },
        { $inc: { counter: 1 } },
        { new: true, upsert: true }
      );
    const userId = counter.counter;

    const decryptedPassword = decryptPassword(password);
    const pass = await bcrypt.hash(decryptedPassword, 10);

    const userBody = {userId, name, email, password: pass, role: "user"};
    const user = await User.create(userBody);

    console.info('New user registers successfully.', { userId: user.userId });
    return {success: true, userId: user.userId, role: user.role, name: user.name };
  } 
  catch(err){
    console.log("Error while running new user registration service", err);
    return {success: false, message: err.message || "RegisterNew User Service Failed."};
  }
    }

    async logins({email, password}){
    try{
        const userExists = await User.findOne({email});
        if (!userExists) return {success: false, message: 'User does not exists. Please register.'};

        const decryptedPassword = decryptPassword(password);

        const authPassword = await bcrypt.compare(decryptedPassword, userExists.password);
        if(!authPassword) return {success: false, message: 'Incorrect Password. Please try again.'};

        const token = jwt.sign({ ...userExists }, process.env.JWT_SECRET, {expiresIn: '3h'});

    console.info('User login successfully.', { userId: userExists.userId });
    return {success: true, token, userId: userExists.userId, name: userExists.name, role: userExists.role };
  } 
  catch(err){
    console.log("Error while running user login service", err);
    return {success: false, message: err.message || "User Login Service Failed."};
  }
    }

      async forgotsPassword({email, password}){
        try{
        const userExists = await User.findOne({email});
     
        if (!userExists || userExists.password === null) return {success: false, message: 'User does not exists. Please register.'};
        
        const otpRecord = await Otp.findOne({email,verified: true,});
        if(!otpRecord) return {success: false, message: 'OTP Isnt verified. Verify your email to reset your password.'}; 
       
        const decryptedPassword = decryptPassword(password);
        const oldPassword = await bcrypt.compare(decryptedPassword, userExists.password);
        if(oldPassword) return {success: false, message: 'Password same as old one. Please select a different password.'};

        const pass = await bcrypt.hash(decryptedPassword, 10);
        const user = await User.findOneAndUpdate({email}, {password: pass});

        console.info('Password reset successfully.', { userId: user.userId });
        return {success: true, userId: user.userId, role: user.role, name: user.name };
    } 
    catch(err){
        console.log("Error while running password reset service", err);
        return {success: false, message: err.message || "Password Reset Service Failed."};
    }
    }

  async sendOtp(email) {
    try {

      const user = await User.findOne({ email });

      if (!user) {
        return {
          success: false,
          message: "User not found.",
        };
      }

      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      await Otp.findOneAndUpdate(
        { email },
        {
          otp,
          verified: false,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
        },
        {
          upsert: true,
          new: true,
        }
      );

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset OTP",
        html: `
          <h3>Password Reset Verification</h3>
          <p>Your OTP is:</p>
          <h2>${otp}</h2>
          <p>This OTP will expire in 10 minutes.</p>
        `,
      });

      return {
        success: true,
        message: "OTP sent successfully.",
      };

    } catch (err) {
      console.log("Error sending OTP", err);

      return {
        success: false,
        message: err.message || "Send OTP Service Failed.",
      };
    }
  }

  async verifyOtp(email, otp) {
    try {

      const otpRecord = await Otp.findOne({ email });

      if (!otpRecord) {
        return {
          success: false,
          message: "OTP not found.",
        };
      }

      if (otpRecord.expiresAt < new Date()) {
        return {
          success: false,
          message: "OTP has expired.",
        };
      }

      if (otpRecord.otp !== otp) {
        return {
          success: false,
          message: "Invalid OTP.",
        };
      }

      otpRecord.verified = true;
      await otpRecord.save();

      return {
        success: true,
        message: "OTP verified successfully.",
      };

    } catch (err) {
      console.log("Error verifying OTP", err);

      return {
        success: false,
        message: err.message || "Verify OTP Service Failed.",
      };
    }
  }
};
export default AuthService;