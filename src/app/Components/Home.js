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
      berry: null,
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
      this.setState({ data: res.data, err: null });
    })
    .catch(e => console.log(e));
  }

  nextPage() {
    axios.get(this.state.data.next).then(res => {
      this.setState({ data: res.data });
    })
    .catch(e => console.log(e));
  }

  previousPage() {
    axios.get(this.state.data.previous).then(res => {
      this.setState({ data: res.data });
    })
    .catch(e => console.log(e));
  }

  getDetails(url) {
    return axios.get(url)
    .then(res => {
      const { data } = res;

      if (data.stats && data.moves) {
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
          err: null,
        });
      } else {
        this.setState({ berry: data });
      }
    })
    .catch(e => console.log(e));
  }

  render() {
    if (!this.state.berry) {
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
                    this.setState({ data: res.data, err: null });
                  }
                })
                .catch(e => {
                  if (e.response.status === 404) {
                    this.setState({ err: 'NotFound' });
                  }
                });
              }}

            />
          </div>
          {this.state.err &&
            <div>
              <h3>{this.state.err}</h3>
            </div>
          }
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

                      this.setState({ pokemon: pokemon.url, err: null });

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
              <div className="navButttons">
                {(this.state.data && this.state.data.previous) &&
                  <input type="button" value="previous" onClick={this.previousPage}/>
                }
                {(this.state.data && this.state.data.next) &&
                  <input type="button" value="next" onClick={this.nextPage}/>
                }
              </div>
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
    } else {
      const data = this.state.berry;
      return (
        <div id="berry">
          <table border = "1">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{data.name}</td>
              </tr>
              <tr>
                <td>Firmness</td>
                <td>{data.firmness.name}</td>
              </tr>
              <tr>
                <td>Growth Time</td>
                <td>{data.growth_time}</td>
              </tr>
              <tr>
                <td>Max Harvest</td>
                <td>{data.max_harvest}</td>
              </tr>
              <tr>
                <td>Natural Gift Power</td>
                <td>{data.natural_gift_power}</td>
              </tr>
              <tr>
                <td>Size</td>
                <td>{data.size}</td>
              </tr>
              <tr>
                <td>Smoothness</td>
                <td>{data.smoothness}</td>
              </tr>
              <tr>
                <td>Soil Dryness</td>
                <td>{data.soil_dryness}</td>
              </tr>
              <tr>
                <td>natural_gift_type</td>
                <td>{data.natural_gift_type.name}</td>
              </tr>

              {data.flavors &&
                data.flavors.map(f =>
                  <tr key={f.flavor.name}>
                    <td>{f.flavor.name}</td>
                    <td>{f.potency}</td>
                  </tr>
                )
              }
            </tbody>
          </table>
          <input
            onClick={() => {
              this.setState({ berry: null, pokemon: null });
            }}

            type="button"
            value="cancel"
            />
        </div>
      );
    }
  }
}
