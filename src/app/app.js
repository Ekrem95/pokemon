import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Components/Home';
import Nav from './Components/Nav';
import Moves from './Components/Moves';
import Details from './Components/Details';

import style from './style.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/moves" component={Moves}/>
            <Route path="/details/:id" component={Details}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.querySelector('#root'));
