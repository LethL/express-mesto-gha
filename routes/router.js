const router = require('express').Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

const ERROR_CODE_CAST = 404;

router.use(usersRoutes);
router.use(cardsRoutes);

router.use((req, res) => {
  res.status(ERROR_CODE_CAST).send({ message: 'Здесь ничего нет' });
});

module.exports = router;
