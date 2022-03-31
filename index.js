import credential from './db/connection'

const express = require('express')
const app = express()
const PORT = 4000
const axios = require('axios')
const Game = require('./models/game')
const cors = require('cors')
const router = express.Router()

app.use(cors())


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/postIn', function (req, res) {

    let dataPost = req.body.random //req.data
    getData(dataPost)
})

app.listen(PORT, function () {
    console.log(`A Aplicação esta rodando na porta: ${PORT}`)
})


function getData(aleatorio) {
  
    console.log(aleatorio)

    let data = axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': `${credential.clientId}`,
            'Authorization': `Bearer ${credential.auth}`
        },
        data: `fields *; where id = ${aleatorio};`
    })
        .then(response => {
            return response.data
            //console.log(response.data)
        })
        .catch(err => {
            console.error(err);
        })

    data.then(function (data) {

        let result = {}

        let ratingValue = Object.keys(data).map(function (key) { return data[key].rating })
        let nameValue = Object.keys(data).map(function (key) { return data[key].name })
        let storylineValue = Object.keys(data).map(function (key) { return data[key].storyline })
        let summaryValue = Object.keys(data).map(function (key) { return data[key].summary })
        let aggregated_ratingValue = Object.keys(data).map(function (key) { return data[key].aggregated_rating })
        let first_release_dateValue = Object.keys(data).map(function (key) { return data[key].first_release_date })
        let genresValue = Object.keys(data).map(function (key) { return data[key].genres })
        let platformsValue = Object.keys(data).map(function (key) { return data[key].platforms })
        let screenshotsValue = Object.keys(data).map(function (key) { return data[key].screenshots })

        let artWorks = axios({
            url: "https://api.igdb.com/v4/covers",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': `${credential.clientId}`,
                'Authorization': `Bearer ${credential.auth}`
            },
            data: `fields alpha_channel,animated,checksum,game,height,image_id,url,width; where game = ${aleatorio};`
        })
            .then(response => {
                return response.data
            })
            .catch(err => {
                console.error(err);
            })

        artWorks.then(function (data) {
            let link = Object.keys(data).map(function (key) { return data[key].url })

            var month = new Array();
            month[0] = "Jan";
            month[1] = "Feb";
            month[2] = "Mar";
            month[3] = "Apr";
            month[4] = "May";
            month[5] = "Jun";
            month[6] = "Jul";
            month[7] = "Aug";
            month[8] = "Sep";
            month[9] = "Oct";
            month[10] = "Nov";
            month[11] = "Dec";

            let d = new Date(0)
            d.setUTCSeconds(first_release_dateValue[0]) //tratamento do formato epoch
            let first_release_date = month[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()

            let linkValue = link[0]

            result.release = first_release_date
            result.rating = ratingValue[0]
            result.name = nameValue[0]
            result.storyline = storylineValue[0]
            result.summary = summaryValue[0]
            result.url = linkValue.replace("t_thumb", "t_cover_big")

            let genres = axios({
                url: "https://api.igdb.com/v4/genres",
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': `${credential.clientId}`,
                    'Authorization': `Bearer ${credential.auth}`
                },
                data: `fields *; where id = (${genresValue});`
            })
                .then(response => {
                    return response.data
                })
                .catch(err => {
                    console.error(err);
                })

            genres.then(function (data) {
                let genres = Object.keys(data).map(function (key) { return data[key].name })
                result.genres = genres


                let screenshots = axios({
                    url: "https://api.igdb.com/v4/screenshots",
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Client-ID': `${credential.clientId}`,
                        'Authorization': `Bearer ${credential.auth}`
                    },
                    data: `fields *; where id = (${screenshotsValue});`
                })
                    .then(response => {
                        return response.data
                        //console.log(response)
                    })
                    .catch(err => {
                        console.error(err);
                    })

                screenshots.then(function (data) {
                    let screenshots = Object.keys(data).map(function (key) { return data[key].url.replace("t_thumb", "t_logo_med") })
                    result.screenshots = screenshots

                    let platforms = axios({
                        url: "https://api.igdb.com/v4/platforms",
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Client-ID': `${credential.clientId}`,
                            'Authorization': `Bearer ${credential.auth}`
                        },
                        data: `fields *; where id = (${platformsValue});`
                    })
                        .then(response => {
                            return response.data
                        })
                        .catch(err => {
                            console.error(err);
                        })

                    platforms.then(function (data) {
                        let platforms = Object.keys(data).map(function (key) { return data[key].name })
                        result.platforms = platforms
                        result.id = aleatorio

                        recebeDados(result)
                        //app.get('/', cors(), function (req, res) { res.send(result) })
                        //return result
                    })
                })
            })
        })
    })
}

const max = 20000
const min = 1
let aleatorioFirst = Math.floor(Math.random() * (max - min) + min)

getData(aleatorioFirst)

function recebeDados(result) {

    let response = {}

    Object.assign(response, result)

    app.use('/', function (req, res, next) {
        res.locals.data = response;
        next()
    })

    console.log(response)

    app.route(`/${response.id}`).get(function (req, res, next) {
        return res.send(response);
    })

    app.get('/', function (req, res) {
        res.send(response)
    })
}