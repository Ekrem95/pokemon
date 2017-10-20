import React, { Component }from 'react';
import { Link }from 'react-router-dom';

export default class Nav extends Component {
  render() {
    return (
      <div id="nav">
        <Link to="/">Home</Link>
        <Link to="/moves">Moves</Link>
      </div>
    );
  }
}
