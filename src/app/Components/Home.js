import React, { Component } from 'react';
import axios from 'axios';
import { pokemon } from '../pokemon';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      pokemon: null,
    };

    this.getDetails = this.getDetails.bind(this);
  }

  componentWillMount() {
    axios.get('https://pokeapi.co/api/v2/pokemon/').then(res => {
      console.log(res.data);
      this.setState({ data: res.data });
    })
    .catch(e => console.log(e));
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
        derails: data,
      });
    });
  }

  render() {
    return (
      <div className="home">
        <div id="pokemons">
          {this.state.data &&
            this.state.data.results.map(pokemon =>
                <div
                  onClick={() => {
                    const selected = document.getElementById(pokemon.url);

                    var elems = document.querySelectorAll('.pokemon');

                    [].forEach.call(elems, function (el) {
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
