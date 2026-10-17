const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createApiRouter = require('./server/api');
const { createDatabase } = require('./server/database');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const createApp = ({ database = createDatabase() } = {}) => {
  const app = express();
  const distPath = path.join(__dirname, 'dist');

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(logger('dev'));
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use('/api', createApiRouter(database));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(distPath));
  app.use('/users', usersRouter);

  app.get('/actividad-1', (req, res) => {
    res.render('index', { title: 'Luma Market' });
  });

  app.get('/', (req, res, next) => {
    res.sendFile(path.join(distPath, 'index.html'), (error) => {
      if (error) {
        if (error.code === 'ENOENT') {
          return res.render('index', { title: 'Luma Market' });
        }
        return next(error);
      }
    });
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Ruta de API no encontrada.' });
  });

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(err.status || 500).json({
        error: err.status === 400 ? 'La solicitud contiene JSON inválido.' : 'Ocurrió un error en el servidor.'
      });
    }

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
};

module.exports = createApp;
