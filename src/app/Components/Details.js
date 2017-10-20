import React, { Component } from 'react';
import axios from 'axios';

export default class Details extends Component {
  constructor() {
    super();

    this.state = {
      data: null,
      id: null,
      entries: null,
    };

  }

  componentWillMount() {
    const id = this.props.location.pathname.split('/').pop();
    this.setState({ id });

    axios.get(`https://pokeapi.co/api/v2/move/${id}/`).then(res => {
      let entries = [];
      res.data.flavor_text_entries.map(f => {
        if (f.language.name === 'en') {
          if (entries.indexOf(f.flavor_text) < 0) {
            entries.push(f.flavor_text);
          }
        }
      });
      this.setState({
        data: res.data, entries,
      });
    })
    .catch(e => console.log(e));
  }

  render() {
    const { data } = this.state;
    if (data) {
      return (
        <div id="details">
          <div className="tables">
            <table border = "1">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{data.name}</td>
                </tr>
                <tr>
                  <td>Power</td>
                  <td>{data.power}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{data.type.name}</td>
                </tr>
                <tr>
                  <td>Priority</td>
                  <td>{data.priority}</td>
                </tr>
                <tr>
                  <td>Accuracy</td>
                  <td>{data.accuracy}</td>
                </tr>
                <tr>
                  <td>Contest type</td>
                  <td>{data.contest_type.name}</td>
                </tr>
                <tr>
                  <td>Damage class</td>
                  <td>{data.damage_class.name}</td>
                </tr>
                <tr>
                  <td>Generation</td>
                  <td>{data.generation.name}</td>
                </tr>
              </tbody>
            </table>
            <table border = "1">
              <tbody>
                <tr>
                  <td>Language</td>
                  <td>Pronunciation</td>
               </tr>
              </tbody>
              {data.names.length > 0 &&
                data.names.map((n, i) =>
                <tbody key={i}>
                  <tr>
                    <td>{n.language.name}</td>
                    <td>{n.name}</td>
                 </tr>
                </tbody>
                )
              }
            </table>
          </div>
          <div>
            <h4>Effects</h4>
            {data.effect_entries &&
              data.effect_entries.map((e, index) => {
                if (e.language.name === 'en') {
                  return (
                    <div key={index}>
                      <p>{e.effect}</p>
                      <p>{e.short_effect}</p>
                    </div>
                  );
                }
              })
            }
            <h4>Tips</h4>
            {(this.state.entries && this.state.entries.length > 0) &&
              this.state.entries.map(f =>
                    <p key={f}>{f}</p>
              )
            }
          </div>
        </div>
      );
    } else {
      return (
        <div className="centre">
          <h3>Loading...</h3>
        </div>
      );
    }
  }
}
