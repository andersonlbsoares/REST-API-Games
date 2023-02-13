const express = require('express');
const app = express();
const Game = require('./database/Games');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/games', (req, res) => {
    res.statusCode = 200;
    Game.findAll({ raw: true }).then(games => {
        res.json(games);
    });
});

app.get('/game/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        Game.findOne({ where: { id: id } }).then(function (game) {
            if (game != undefined) {
                res.statusCode = 200;
                res.json(game);
            } else {
                res.sendStatus(404);
            }
        }).catch(function (err) {
            res.sendStatus(404);
        });
    }
});

app.post("/game", (req, res) => {
    var title = req.body.title;
    var price = parseFloat(req.body.price);
    var year = parseInt(req.body.year);
    Game.create({
        "title": title,
        "price": price,
        "year": year
    })
        .then(() => {
        }).catch((err) => {
            console.log(err);
        })

    res.sendStatus(200);
});

app.delete('/game/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        Game.destroy({
            where: {
                id: id
            }
        }).then(function () {
            res.sendStatus(200);
        }
        ).catch(function (err) {
            res.sendStatus(404);
        }
        );
    }
});

app.put('/game/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        var updates = {};
        if (req.body.title) updates.title = req.body.title;
        if (req.body.price) updates.price = parseFloat(req.body.price);
        if (req.body.year) updates.year = parseInt(req.body.year);
        Game.update(updates, {
            where: {
                id: id
            }
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(404);
        });
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
