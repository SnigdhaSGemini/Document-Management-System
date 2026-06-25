import Joi from 'joi';

export const registerValidations = (req, res, next) => {
  const schema =  Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required()
  });
  
const { error } = schema.validate(req.body); 

  if (error) return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message 
    });

  next();
};

export const loginValidations = (req, res, next) => {
  const schema =  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body); 

  if (error) return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message 
    });
  next();
};

export const forgotPasswordValidations = (req, res, next) => {
  const schema =  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required()
  });
 const { error } = schema.validate(req.body); 

  if (error) return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message 
    });
  next();
};