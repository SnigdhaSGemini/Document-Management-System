
import AuthService from './../services/authServices.js';

export const register = async (req , res) => {
    try{  
         const authService = new AuthService();
         const response = await authService.registers(req.body);

         const {success, ...data} = response;

        if(success){
         console.log(`New user registers with userId : ${response.userId}`);
         res.status(201).json({success: true, message: `User with name: ${response.name} gets registered successfully!`, ...data});
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const login = async (req , res) => {
    try{  
         const authService = new AuthService();
         const response = await authService.logins(req.body);

         const {success, token, ...data} = response;

        if(success){
         console.log(`User Login with name : ${response.name}`);
         res.status(201).json({success: true, message: "User login successfully!", token, data: {...data}});
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};

export const  forgotPassword = async (req , res) => {
    try{  
         const authService = new AuthService();
         const response = await authService.forgotsPassword(req.body);

         const {success, ...data} = response;

        if(success){
         console.log(`Password reset for user with userId : ${response.userId}`);
         res.status(201).json({success: true, message: `Password reset for user with name: ${response.name}.`, ...data});
        }
        else{
             res.status(400).json(response);
        }
    }
    catch(err) {
        res.status(500).json({success: false, message: err.message || "Something went wrong."});
    }
};