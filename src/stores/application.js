import {observable, computed} from 'mobx';

class AppStore {
  @observable open = false
  @observable location = {}

  constructor({location}) {
    this.location = location;
  }
  
  @computed get currentItem() {
    if (this.location.pathname.indexOf('/foci/') !== -1) {
      return this.location.pathname;
    } else {
      return '/foci/monitor'
    }
  }

}


export default AppStore;