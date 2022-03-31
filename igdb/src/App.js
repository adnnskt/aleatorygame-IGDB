import './App.css';
import React from 'react'
import axios from 'axios'
import Summary from './Summary'
//import { useState } from 'react';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      release: '',
      rating: 0,
      name: '',
      url: '',
      summary: '',
      genres: [],
      screenshots: [],
      platforms: [],
      controller: 0,
    }
  }


  changeData = (aleatorio) => {
    const dataChange = this //seta o this de uma const para acessa-lo posteriormente dentro da promise  

    axios.get(`http://localhost:4000/${aleatorio}`)
      .then(function (response) {

        let name = response.data.name
        let url = response.data.url
        let rating = response.data.rating
        let release = response.data.release
        let summary = response.data.summary
        let genres = response.data.genres
        let screenshots = response.data.screenshots
        let platforms = response.data.platforms

        dataChange.setState({
          name: name, url: url, rating: rating, summary: summary, genres: genres,
          screenshots: screenshots, platforms: platforms, release: release,
          controler: 0
        })

        let textBox = document.querySelector('.text-box')
        let elipse = document.querySelector('.elipse')
        let genresElement = document.querySelector('.genres')
        let joystick = document.querySelector('.joystick')
        let textScreenshots = document.querySelector('.text-screenshots')
        let h1 = document.querySelector('h1')
        let gif = document.querySelector('.gif')
        let loadPage = document.querySelector('.load-page')

        textBox.style.visibility = "visible";
        elipse.style.visibility = "visible";
        genresElement.style.visibility = "visible";
        joystick.style.visibility = "visible";
        textScreenshots.style.visibility = "visible"
        h1.style.visibility = "visible"
        gif.style.visibility = "hidden"
        loadPage.style.visibility = "hidden"

        //console.log(dataChange)
      })
      .catch(function (error) {
        if (dataChange.state.controller <= 3) {
          dataChange.setState({
            release: '',
            rating: 0,
            name: '',
            url: '',
            summary: '',
            genres: [],
            screenshots: [],
            platforms: [],
            controller: dataChange.state.controller += 1,
          })
          dataChange.postData()
          console.log(error)
          console.log(dataChange.state.controller)
        } else {
          let gif = document.querySelector('.gif')
          let loadPage = document.querySelector('.load-page')
          let joystick = document.querySelector('.joystick')
          gif.style.visibility = "hidden"
          loadPage.style.visibility = "hidden"
          joystick.style.visibility = "visible";
          dataChange.setState({
            controller: 0,
          })
        }
      })
  }

  postData = () => {
    const max = 20000
    const min = 1

    let aleatorio = Math.floor(Math.random() * (max - min) + min)
    let textBox = document.querySelector('.text-box')
    let elipse = document.querySelector('.elipse')
    let genres = document.querySelector('.genres')
    let joystick = document.querySelector('.joystick')
    let textScreenshots = document.querySelector('.text-screenshots')
    let h1 = document.querySelector('h1')
    let gif = document.querySelector('.gif')
    let loadPage = document.querySelector('.load-page')

    textBox.style.visibility = "hidden";
    elipse.style.visibility = "hidden";
    genres.style.visibility = "hidden";
    joystick.style.visibility = "hidden";
    textScreenshots.style.visibility = "hidden"
    h1.style.visibility = "hidden"
    gif.style.visibility = "visible"
    loadPage.style.visibility = "visible"

    axios.post('http://localhost:4000/postIn', {
      random: `${aleatorio}`
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    setTimeout(() => { this.changeData(aleatorio) }, 5000)
  }

  getData = () => {
    const data = this //seta o this de uma const para acessa-lo posteriormente dentro da promise  

    axios.get('http://localhost:4000/')
      .then(function (response) {

        let name = response.data.name
        let url = response.data.url
        let rating = response.data.rating
        let release = response.data.release
        let summary = response.data.summary
        let genres = response.data.genres
        let screenshots = response.data.screenshots
        let platforms = response.data.platforms

        data.setState({
          name: name, url: url, rating: rating, summary: summary, genres: genres,
          screenshots: screenshots, platforms: platforms, release: release
        })

        //console.log(data)
      })
      .catch(function (error) {

        console.log(error);
      })
  }


  render() {

    //this.getData()
    let genresRow = []

    for (let i = 0; i < this.state.genres.length; i++) {
      genresRow.push(<a key={i}> {this.state.genres[i]} | </a>)
    }

    let platformsRow = []

    for (let i = 0; i < this.state.platforms.length; i++) {
      platformsRow.push(<a key={i}> {this.state.platforms[i]} | </a>)
    }

    let screenshotsData = []

    if (this.state.screenshots.length > 0) {
      for (let i = 0; i < 3; i++) {
        screenshotsData.push(<div className="ss-img" key={i}><img src={this.state.screenshots[i]}></img></div>)
      }
    } else { console.log(this.state.screenshots) }

    return (
      <div>
        <div className="load-page fade-out">
          <div className="gif pulse"></div>
        </div>
        <div className="App fade-in">

          <p className='title'>aleatorygame.</p>
          <button className="joystick fade-in" onClick={this.postData}>Click</button>
          <div className="elipse fade-in"><p>{Math.round(this.state.rating)}</p></div>
          <h1>{this.state.name}</h1>
          <div className="genres fade-in">
            <span> Genres: {genresRow}</span>
            <span > Platforms: {platformsRow} </span>
            <span> Release: <a>{this.state.release}</a></span>
          </div>
          <img className="fade-in"src={this.state.url}></img>
        </div>
        <Summary summary={this.state.summary}></Summary>
        <p className="text-screenshots fade-in">Screenshots:</p>
        <div className="screen-shots fade-in">{screenshotsData}</div>
      </div>
    );
  }
}

export default App;
