const router = require('express').Router();

module.router.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  const errorMessage = statusCode === 500 ? 'На сервере произошла ошибка' : message;
  res.status(statusCode).send({ message: errorMessage });
  next();
});

module.exports = router;
