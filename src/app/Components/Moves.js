import React, { Component } from 'react';
import axios from 'axios';

export default class Moves extends Component {
  constructor() {
    super();

    this.state = {
      data: null,
    };

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  componentWillMount() {
    axios.get('https://pokeapi.co/api/v2/move/').then(res => {
      this.setState({ data: res.data });
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

  render() {
    return (
      <div id="movesPage">
        <div className="names">
          {this.state.data &&
            this.state.data.results.map(r =>
              <div
                onClick={() => {
                  let ids = r.url.split('/');
                  ids = ids.filter(i => i !== '');
                  this.props.history.push(`/details/${ids[ids.length - 1]}`);
                }}

                key={r.url}>{r.name.replace(/-/g, ' ')}
              </div>
            )
          }
        </div>
        <div className="navButttons">
          {(this.state.data && this.state.data.previous) &&
            <input type="button" value="previous" onClick={this.previousPage}/>
          }
          {(this.state.data && this.state.data.next) &&
            <input type="button" value="next" onClick={this.nextPage}/>
          }
        </div>
      </div>
    );
  }
}
