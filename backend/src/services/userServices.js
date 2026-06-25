import { Counter } from "../models/counterSchema.js";
import { User } from "../models/userSchema.js";

class UserService {

  async createsUser(name, email, role){
    try{
    const userExists = await User.findOne({email});
     
    if (userExists) {
      return {success: false, message: 'User already exists.'};
    }

    const counter = await Counter.findOneAndUpdate(
        { name: "userId" },
        { $inc: { userId: 1 } },
        { new: true, upsert: true }
      );
    const userId = counter.userId;

    const userBody = {userId, name, email, password: null, role};
    const user = await User.create(userBody);
    console.info('User created successfully.', { userId: user.userId });
    return {success: true, userId: user.userId, role: user.role };
  } 
  catch(err){
    console.log("Error while running user creation service", err);
    return {success: false, message: err.message || "Create User Service Failed."};
  }
    }
};
export default UserService;