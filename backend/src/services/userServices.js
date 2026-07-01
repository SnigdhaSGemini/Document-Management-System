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
        { $inc: { counter: 1 } },
        { new: true, upsert: true }
      );
    const userId = counter.counter;
    console.log(counter, " :: counter");

    const userBody = {userId, name, email, password: null, role, isActive: true};
    const user = await User.create(userBody);
    console.info('User created successfully.', { userId: user.userId });
    return {success: true, userId: user.userId, role: user.role };
  } 
  catch(err){
    console.log("Error while running user creation service", err);
    return {success: false, message: err.message || "Create User Service Failed."};
  }
    }

  async getAllReviewers(){
    try{
    
    const reviewers = await User.find({ role: "reviewer" });

     console.info('Reviewers fetched successfully');

    return {
      success: true,
      message: "Reviewers fetched successfully",
      data: reviewers
    };
  } 
  catch(err){
    console.log("Error while getting reviewers service", err);
    return {success: false, message: err.message || "Get All Reviewers Service Failed."};
  }
    }

    async getsAllUsers(payload) {
    try {
      const {page, limit, search, role, isActive} = payload;
      console.log("payload:: ", payload);

      const filter = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ];
      }
      if (role) {
        filter.role = role;
      }

      if (isActive !== undefined && isActive !== "") {
        filter.isActive =
          isActive === true ||
          isActive === "true";
      }

      // Pagination
      const skip = (page - 1) * limit;

      const [users, totalCount] = await Promise.all([
        User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        User.countDocuments(filter),
      ]);

      return {
        success: true,
        message: "All users fetched successfully.",
        data: users,
        count: totalCount,
      };
    } catch (err) {
      console.log("Error while running get all users service", err);

      return {
        success: false,
        message: err.message || "Get All Users Service Failed.",
      };
    }
  }

  async updatesUser(userId, payload) {
    try {
      const { name, email, role, isActive } = payload;

      const user = await User.findById(userId);

      if (!user) {
        return {
          success: false,
          message: "User not found."
        };
      }

      // Check duplicate
      if (email && email !== user.email) {
        const existingUser = await User.findOne({email, _id: { $ne: userId }});
        if (existingUser) {
          return {
            success: false,
            message: "Email already exists."
          };
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...(name && { name }),
          ...(email && { email }),
          ...(role && { role }),
          ...(isActive !== undefined && { isActive })
        },
        {
          new: true
        }
      ).select("-password");

      console.info("User updated successfully.", {
        userId: updatedUser.userId
      });

      return {
        success: true,
        message: "User updated successfully.",
        data: updatedUser
      };
    } catch (err) {
      console.log("Error while updating user service", err);

      return {
        success: false,
        message: err.message || "Update User Service Failed."
      };
    }
  }

  async deletesUser(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return {
          success: false,
          message: "User not found.",
        };
      }

      const res = await User.findByIdAndDelete(userId);
      console.info("User deleted successfully.", {userId: user.userId,});

      return {
        success: true,
        message: "User deleted successfully.",
        data: res
      };
    } catch (err) {
      console.log("Error while running delete user service", err);

      return {
        success: false,
        message: err.message || "Delete User Service Failed.",
      };
    }
  }

};
export default UserService;