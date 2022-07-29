const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_CAST = 404;
const ERROR_CODE_SERVER = 500;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62e2530b487b39cee3aa34ab',
  };

  next();
});

app.use(usersRoutes);
app.use(cardsRoutes);

app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(ERROR_CODE_CAST);
    res.send({ message: 'Карточка или пользователь не найден' });
  }
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE_VALIDATION);
    res.send({
      message: `Переданы некорректные данные в методы создания карточки,
    пользователя, обновления аватара пользователя или профиля`,
    });
  }
  res.status(ERROR_CODE_SERVER).send({ message: 'ошибка по-умолчанию' });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});
