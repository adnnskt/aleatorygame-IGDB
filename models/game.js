const Sequelize = require('sequelize');
const db = require('../db/connection'); //arquivo de conexão com o banco

const Game = db.define('game', {
    rating: {
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING
    },
    storyline: {
        type: Sequelize.STRING
    },
    summary: {
        type: Sequelize.STRING
    },
    first_release_date: {
        type: Sequelize.STRING
    },
});


module.exports = Game

