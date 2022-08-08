const Card = require('../models/card');

const { ERROR_CODE_VALIDATION, ERROR_CODE_CAST, ERROR_CODE_SERVER } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_CAST).send({ message: 'Карточка с указанным id не найдена.' });
      } else if (card.owner._id.toString() !== req.user._id.toString()) {
        res.status(ERROR_CODE_CAST).send({ message: 'Недостаточно прав для удаления.' });
      } else {
        card.remove();
        res.send({ message: 'Успешно удалено' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Передан некорректный id карточки.' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_CAST).send({ message: 'Карточка с указанным id не найдена.' });
      } else {
        res.send({ message: 'Лайк поставлен' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Передан некорректный id карточки.' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_CAST).send({ message: 'Карточка с указанным id не найдена.' });
      } else {
        res.send({ message: 'Лайк удален' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Передан некорректный id карточки.' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Ошибка по-умолчанию.' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
