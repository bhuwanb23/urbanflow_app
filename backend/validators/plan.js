const Joi = require('joi');

const journeyPlanSchema = Joi.object({
  fromPlace: Joi.string().required().messages({
    'any.required': 'Origin location (fromPlace) is required'
  }),
  toPlace: Joi.string().required().messages({
    'any.required': 'Destination location (toPlace) is required'
  }),
  modes: Joi.string().optional(),
  time: Joi.string().optional(),
  date: Joi.string().optional(),
  numItineraries: Joi.number().integer().min(1).max(10).optional(),
  wheelchair: Joi.boolean().optional(),
  optimize: Joi.string().valid('QUICK', 'SAFE', 'GREEN').optional()
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ success: false, error: messages.length === 1 ? messages[0] : messages });
  }
  next();
};

module.exports = { journeyPlanSchema, validate };
