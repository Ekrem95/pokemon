import React, { Component } from 'react';
import axios from 'axios';

export default class Home extends Component {
  render () {
    return (<div></div>);
  }

  constructor() {
    super();
    this.state = {
      data: null,
      pokemon: null,
      mainUrl: 'https://pokeapi.co/api/v2/pokemon/',
    };

    this.getMain = this.getMain.bind(this);
    this.getDetails = this.getDetails.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  componentWillMount() {
    this.getMain(this.state.mainUrl);
  }

  getMain(url) {
    axios.get(url).then(res => {
      this.setState({ data: res.data });
    })
    .catch(e => console.log(e));
  }

  previousPage() {
    let mainUrl = this.state.mainUrl;
    if (mainUrl.indexOf('offset') < 0) {
      return;
    } else {
      const offsetindex = mainUrl.indexOf('offset=');
      let value = mainUrl.substring(offsetindex + 'offset='.length, mainUrl.length);
      value = parseInt(value - 20);
      if (value > 20) {
        mainUrl = mainUrl.substr(0, offsetindex + 'offset='.length) + value;
        this.setState({ mainUrl });
      }else {
        mainUrl = mainUrl.substr(0, offsetindex);
        this.setState({ mainUrl });
      }

      this.getMain(mainUrl);
    }
  }

  nextPage() {
    let mainUrl = this.state.mainUrl;
    if (mainUrl.indexOf('offset') < 0) {
      mainUrl += '?offset=20';
      this.setState({ mainUrl });
    } else {
      const offsetindex = mainUrl.indexOf('offset=');
      let value = mainUrl.substring(offsetindex + 'offset='.length, mainUrl.length);
      value = parseInt(value + 20);
      mainUrl = mainUrl.substr(0, offsetindex + 'offset='.length) + value;
      this.setState({ mainUrl });
    }

    this.getMain(mainUrl);
  }

  getDetails(url) {
    return axios.get(url)
    .then(res => {
      const { data } = res;

      let total = 0;
      for (let i = 0; i < data.stats.length; i++) {
        total += data.stats[i].base_stat;
      }

      let avg = Math.floor(total / data.stats.length);

      let moves = [];
      for (let i = 0; i < data.moves.length; i++) {
        let move = data.moves[i].move.name;
        move = move.replace(/-/g, ' ');
        moves.push(move);
      }

      this.setState({
        name: data.name,
        score: avg,
        moves,
        species: data.species.name,
        sprites: data.sprites,
        details: data,
      });
    });
  }

  render() {
    return (
      <div className="home">
        <div id="searchBox">
          <input id="searchVal" type="text" placeholder="Search pokemon types" />
          <input
            type="button"
            value="Search"
            onClick={() => {
              const searchVal = document.getElementById('searchVal').value;
              axios.get(`https://pokeapi.co/api/v2/${searchVal}/`).then(res => {
                if (res.data.results) {
                  this.setState({ data: res.data });
                }
              })
              .catch(e => console.log(e));
            }}

          />
        </div>
        <div id="pokemons">
          {this.state.data &&
            this.state.data.results.map(pokemon =>
                <div
                  onClick={() => {
                    const selected = document.getElementById(pokemon.url);

                    var elems = document.querySelectorAll('.pokemon');

                    [].forEach.call(elems, (el) => {
                        el.classList.remove('selected-pokemon');
                      });

                    selected.className += selected.className ? ' selected-pokemon' : 'pokemon';

                    this.setState({ pokemon: pokemon.url });

                    this.getDetails(pokemon.url);
                  }}

                  className="pokemon"
                  id={pokemon.url}
                  key={pokemon.url}>
                  <span>{pokemon.name}</span>
                </div>
              )
          }
        </div>
        {this.state.data &&
          <div>
          {this.state.mainUrl.indexOf('offset') > -1 &&
          <div className="navButttons">
            <input type="button" value="previous" onClick={this.previousPage}/>
            <input type="button" value="next" onClick={this.nextPage}/>
          </div>
          }

          {(this.state.mainUrl.indexOf('offset') < 0 &&
            this.state.data.count > 20
          ) &&
          <div className="navButttons">
            <input type="button" value="next" onClick={this.nextPage}/>
          </div>
          }
          </div>
        }
        <div id="pokemon-specs">
          {!this.state.pokemon &&
            <div>
              <h3>Please select a Pokemon</h3>
            </div>
          }
          {this.state.pokemon &&
            <div>
              <div id="titles">
                <div>Name   : {this.state.name}</div>
                <div>Species: {this.state.species}</div>
                <div>Score  : {this.state.score}</div>
              </div>
              <div>
                {this.state.sprites &&
                  Object.keys(this.state.sprites).map((key, index) => {
                    if (this.state.sprites[key] !== null) {
                      return (
                        <img key={index} src={this.state.sprites[key]}/>
                      );
                    }
                  })
                }
              </div>
              <h2>Moves</h2>
              <div id="moves">
                  {this.state.moves &&
                    this.state.moves.map((m, i) =>
                      <div key={m}>{m}</div>
                    )
                  }
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
