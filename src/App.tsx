import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route
} from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import './styles/App.scss';
import Game from './features/game/game';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="header">
          <Link to="/" className="navlink">5 x 5</Link>
          <Link to="/7x7" className="navlink">7 x 7</Link>
          <Link to="/10x10" className="navlink">10 x 10</Link>
        </div>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 1 }}
          atActive={{ opacity: 1 }}
          className="switch-wrapper" 
        >
          <Route path="/7x7">
            <Game size={7} />
          </Route>
          <Route path="/10x10">
            <Game size={10} />
          </Route>
          <Route path="/">
            <Game size={5} />
          </Route>
        </AnimatedSwitch>
      </Router>
    </div>
  );
}

export default App;
