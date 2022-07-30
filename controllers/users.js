const User = require('../models/user');
const { ERROR_CODE_VALIDATION, ERROR_CODE_CAST, ERROR_CODE_SERVER } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_CAST).send({ message: 'Пользователь по указанному id не найден.' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при поискеs пользователя.' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_CAST).send({ message: 'Пользователь по указанному id не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const avatar = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, avatar, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_CAST).send({ message: 'Пользователь по указанному id не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
