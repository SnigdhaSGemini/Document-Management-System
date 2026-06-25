import jwt from 'jsonwebtoken';

export const authUser = (req, res, next) => {
    try{
        const auth = req.headers['authorization'];
        if(!auth) return res.status(403).json({success: false, message: "Unauthorized user. JWT token not found."});
        
        const token = auth.split(" ")[1];  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    }
    catch(err){
        return res.status(403).json({success: false, message: "Unauthorized access, token expired/ wrong."})
    }
};