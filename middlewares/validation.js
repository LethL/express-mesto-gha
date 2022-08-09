const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const avatarLinkRegExp = /(http:\/\/|https:\/\/)(www)*[a-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+#*/;

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(20),
    avatar: Joi.string().pattern(avatarLinkRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(avatarLinkRegExp),
  }),
});

module.exports = { userValidation, loginValidation, avatarValidation };