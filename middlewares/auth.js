const jwt = require('jsonwebtoken');
const { ERROR_CODE_AUTH } = require('../errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_CODE_AUTH).send({ message: 'Неправильные почта или пароль.' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(ERROR_CODE_AUTH).send({ message: 'Неправильные почта или пароль.' });
  }

  req.user = payload;

  return next();
};
