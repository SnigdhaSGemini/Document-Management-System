import { Counter } from "../models/counterSchema.js";
import { User } from "../models/userSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


class AuthService {

  async registers({name, email, password}){
    try{
        const userExists = await User.findOne({email});
     
        if (userExists && userExists.password !== null) {
            return {success: false, message: 'User already exists.'};
        }
        else if(userExists) {
            const pass = await bcrypt.hash(password, 10);
            const user = await User.findOneAndUpdate({email}, {password: pass});

            console.info('New user registers successfully.', { userId: user.userId });
            return {success: true, userId: user.userId, role: user.role, name: user.name };
        }
        const counter = await Counter.findOneAndUpdate(
        { name: "userId" },
        { $inc: { userId: 1 } },
        { new: true, upsert: true }
      );
    const userId = counter.userId;
    const pass = await bcrypt.hash(password, 10);

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

        const authPassword = await bcrypt.compare(password, userExists.password);
        if(!authPassword) return {success: false, message: 'Incorrect Password. Please try again.'};

        const token = jwt.sign({ ...userExists }, process.env.JWT_SECRET, {expiresIn: '3h'});

    console.info('User login successfully.', { userId: userExists.userId });
    return {success: true, token, userId: userExists.userId, name: userExists.name };
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
       
        const oldPassword = await bcrypt.compare(password, userExists.password);
        if(oldPassword) return {success: false, message: 'Password same as old one. Please select a different password.'};

        const pass = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate({email}, {password: pass});

        console.info('Password reset successfully.', { userId: user.userId });
        return {success: true, userId: user.userId, role: user.role, name: user.name };
    } 
    catch(err){
        console.log("Error while running password reset service", err);
        return {success: false, message: err.message || "Password Reset Service Failed."};
    }
    }
};
export default AuthService;