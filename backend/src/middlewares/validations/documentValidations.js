import Joi from "joi";

export const createDocumentValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(1).required(),
  });

  const { error } = schema.validate(req.body, {
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message
    });
  }
  
  next();
};

export const getAllDocumentsValidation = (req, res, next) => {
  const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),

    type: Joi.string().optional(),

    page: Joi.number().min(0).default(0).optional(),
    limit: Joi.number().min(1).default(5).optional(),
  }).custom((value, helpers) => {
    const { startDate, endDate } = value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return helpers.error("any.invalid");
    }

    return value;
  }, "Date range validation");

  const { error, value } = schema.validate(req.body, {
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
      error: error.details[0].message,
    });
  }

  req.body = value;
  next();
};

export const updateDocumentValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).optional(),
    content: Joi.string().optional()
  }).or("title", "content");

  const { error, value } = schema.validate(req.body, {
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message
    });
  }

  req.body = value;
  next();
};

export const documentIdValidation = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required()
  });

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({
      message: "Invalid Document ID",
      error: error.details[0].message
    });
  }

  next();
};

export const commentValidation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    user: Joi.string().required(),
    body: Joi.string().min(1).required()
  });

  const { error, value } = schema.validate(req.body, {
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message
    });
  }

  req.body = value;
  next();
};

export const changeReviewerValidation = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    reviewer: Joi.string().min(1).required(),
    reviewerId: Joi.string().required() 
  });

  const { error, value } = schema.validate(
    { ...req.body },
    {
      stripUnknown: true
    }
  );

  if (error) {
    return res.status(400).json({
      message: "Bad Request",
      error: error.details[0].message
    });
  }

  next();
};