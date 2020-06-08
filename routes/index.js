const routes = require('express').Router();

const
main = require('./main'),
api = require('./api');


routes.use('/',main);

routes.use('/',api);

routes.get('*' , (req,res) => {
    res.redirect('/');
});

module.exports = routes;
