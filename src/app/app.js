import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Components/Home';

import style from './style.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Home}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.querySelector('#root'));
