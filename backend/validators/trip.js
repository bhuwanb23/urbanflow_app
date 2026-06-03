const Joi = require('joi');

const locationSchema = Joi.object({
  name: Joi.string().allow('').optional(),
  lat: Joi.number().min(-90).max(90).required().messages({
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Location latitude is required'
  }),
  lon: Joi.number().min(-180).max(180).required().messages({
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Location longitude is required'
  })
});

const createTripSchema = Joi.object({
  from: locationSchema.required().messages({ 'any.required': 'Origin location is required' }),
  to: locationSchema.required().messages({ 'any.required': 'Destination location is required' }),
  mode: Joi.string().required().messages({ 'any.required': 'Transport mode is required' }),
  distance: Joi.number().min(0).optional(),
  duration: Joi.number().min(0).optional(),
  carbonSaved: Joi.number().min(0).optional(),
  cost: Joi.number().min(0).optional(),
  caloriesBurned: Joi.number().min(0).optional()
});

const updateTripSchema = Joi.object({
  from: locationSchema.optional(),
  to: locationSchema.optional(),
  mode: Joi.string().optional(),
  distance: Joi.number().min(0).optional(),
  duration: Joi.number().min(0).optional(),
  carbonSaved: Joi.number().min(0).optional(),
  cost: Joi.number().min(0).optional(),
  caloriesBurned: Joi.number().min(0).optional()
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

module.exports = { createTripSchema, updateTripSchema, validate };
