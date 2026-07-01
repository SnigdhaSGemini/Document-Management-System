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

export const getAllUsersValidation = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().default(1).required(),
    limit: Joi.number().min(1).default(10).required(),
    search: Joi.string().allow("").optional(),
    role: Joi.string().valid("admin", "user", "reviewer").optional(),
    isActive: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message,
    });
  }

  next();
};

export const updateUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid("admin", "user", "reviewer").optional(),
    isActive: Joi.boolean().optional(),
  })
  .min(1);

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message,
    });
  }

  next();
};

export const deleteUserValidation = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).hex().required(),
  });

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message,
    });
  }

  next();
};
