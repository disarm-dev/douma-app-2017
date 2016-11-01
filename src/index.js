import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './components/App/App';
import {muiTheme} from './config/muiTheme';
import './index.css';

injectTapEventPlugin();


const About = ({children}) => (
  <div>
    {children}
  </div>
)

const Welcome = () => (
  <div>
    <h1>Welcome to DUMA, please select an option from the side menu.</h1>
  </div>
)

const Message = ({location}) => (
  <div>
    <h1>We haven't made a component here's your url: {location.pathname}</h1>
  </div>
)

const DUMA = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Welcome}/>
        <Route path="foci" component={About}>
          <IndexRoute component={Message}/> 
          <Route path="monitor" component={Message}>
            <Route path="map" component={Message} />
            <Route path="list" component={Message} />
          </Route>
          <Route path="identify" component={Message}/>
          <Route path="investigate" component={Message}/>
          <Route path="classify" component={Message}/>
          <Route path="respond" component={Message}/>
        </Route>
        <Route path="irs" component={About}>
          <Route path="monitor" component={Message}/>
        </Route>
      </Route>
    </Router>
  </MuiThemeProvider>
)

render(<DUMA />, document.getElementById('root'));
