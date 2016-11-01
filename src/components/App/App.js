import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import Divider from 'material-ui/Divider';
import { withRouter } from 'react-router'
import {composeWithMobx} from 'react-komposer';
import {observer} from "mobx-react";

import DropDownMenu from 'material-ui/DropDownMenu';


import ApplicationStore from '../../stores/application';
import './App.css';


var App = ({store, children, router, width, location}) => {
  const click = (route) => {
    router.push(route);
    store.open = false;
  }

  return (
    <div>
      <AppBar title="DiSARM" onLeftIconButtonTouchTap={() => store.open = true} iconElementRight={

        <DropDownMenu value={store.currentItem} labelStyle={{color: 'white'}}>
          <MenuItem value={'/foci/monitor'} primaryText="Monitor" onTouchTap={() => router.push('/foci/monitor')} />
          <MenuItem value={'/foci/identify'} primaryText="Identify" onTouchTap={() => router.push('/foci/identify')} />
          <MenuItem value={'/foci/investigate'} primaryText="Investigate" onTouchTap={() => router.push('/foci/investigate')} />
          <MenuItem value={'/foci/classify'} primaryText="Classify" onTouchTap={() => router.push('/foci/classify')} />
          <MenuItem value={'/foci/respond'} primaryText="Respond" onTouchTap={() => router.push('/foci/respond')} />
        </DropDownMenu>

      } />
      


      <Drawer open={store.open} onRequestChange={(open) => store.open = open} docked={false}>
        
        <AppBar title="Menu" showMenuIconButton={false} />
        
        <MenuItem onTouchTap={() => click('/')}>Home</MenuItem>
        <MenuItem onTouchTap={() => click('/foci')}>Foci Investigation</MenuItem>
        <MenuItem onTouchTap={() => click('/irs')}>IRS</MenuItem>
        
        <Divider />

        <MenuItem>About</MenuItem>
        <MenuItem>Website</MenuItem>

      </Drawer>

      <div>
        {children}
      </div>
    </div>
  )
};



// Observe mobx
App = observer(App)

// Inject router
App = withRouter(App)

// Inject store
App = composeWithMobx(({location}, onData) => {
  const store = new ApplicationStore({location});
  onData(null, {store})
})(App);

export default App;





// /foci/monitor/list

var a = {
  modules: [
    {
      name: 'meta',
      tasks: [
        {
          name: 'user',
          views: ['login', 'logout']
        },
        {
          name: 'aoi',
          views: ['map_pin']
        },
        {
          name: 'sync',
          views: ['status']
        }
      ]
    },
    {
      name: 'foci',
      tasks: [
        {
          name: 'monitor', // multiple focis
          views: ['map', 'list']
        },
        {
          name: 'identify', // multiple focis
          views: ['map (focis)', 'list']
        },
        {
          name: 'investigate', // individual foci
          views: ['map', 'map_edit', 'detail']
        },
        {
          name: 'classify', // individual foci
          views: ['form', 'detail']
        },
        {
          name: 'respond', // individual foci
          views: ['form', 'detail']
        }
      ]
    },
    {
      name: 'irs', 
      tasks: [
        {}
      ]
    }
  ],
}




