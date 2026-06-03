const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  phone: Joi.string().max(20).optional(),
  preferences: Joi.object({
    language: Joi.string().valid('en', 'hi').optional(),
    currency: Joi.string().valid('INR').optional(),
    mobilityGoals: Joi.array().items(Joi.string()).optional(),
    preferredTransport: Joi.array().items(Joi.string()).optional(),
    accessibilityNeeds: Joi.array().items(Joi.string()).optional(),
    notificationsEnabled: Joi.boolean().optional()
  }).optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ success: false, error: messages.length === 1 ? messages[0] : messages });
  }
  next();
};

module.exports = { updateProfileSchema, validate };
