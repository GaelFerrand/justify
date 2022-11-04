import * as Joi from 'joi';

export const justifyTextDto = Joi.object().keys({
  text: Joi.string().min(0).max(50000).required(),
  token: Joi.string()
    .length(36)
    .regex(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    )
    .required(),
});
