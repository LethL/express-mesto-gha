const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_CODE_VALIDATION, ERROR_CODE_CAST, ERROR_CODE_SERVER, ERROR_CODE_AUTH, ERROR_CODE_DUPLICATE,
} = require('../errors/errors');

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
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.code === 11000) {
        res.status(ERROR_CODE_DUPLICATE).send({ message: 'Пользователь с таким email уже существует.' });
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

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ token });
    })
    .catch(() => res.status(ERROR_CODE_AUTH).send({ message: 'Неправильные почта или пароль.' }));
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getCurrentUser,
};
