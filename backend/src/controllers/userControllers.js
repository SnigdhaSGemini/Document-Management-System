import UserService from "../services/userServices.js";

export const createUser = async (req , res) => {
    try{
         const { name, email, role} = req.body;
        
         const userService = new UserService();
         const response = await userService.createsUser(name, email, role);

         const {success, ...data} = response;

        if(success){
         console.log(`User created with userId : ${response.userId}`);
         res.status(201).json({success: true, message: `User with name: ${name} created successfully!`, ...data});
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};