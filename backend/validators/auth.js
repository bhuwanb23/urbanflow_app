const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).required()
    .pattern(/\d/, '1 number')
    // eslint-disable-next-line no-useless-escape
    .pattern(/[!@#$%^&*(),.?":{}|<>_\-~`+=\[\]\\';\/]/, '1 special character')
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.name': 'Password must contain at least {#name}',
      'any.required': 'Password is required'
    }),
  name: Joi.string().allow('').optional(),
  phone: Joi.string().allow('').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ success: false, error: messages.length === 1 ? messages[0] : messages });
  }
  next();
};

module.exports = { registerSchema, loginSchema, validate };
