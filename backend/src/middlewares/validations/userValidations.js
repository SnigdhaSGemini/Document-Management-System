import Joi from 'joi';

export const createUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    role: Joi.string()
      .valid('admin', 'user', 'reviewer') 
      .required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message
    });
  }

  next();
};
