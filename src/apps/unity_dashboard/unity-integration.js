import {load_data_into_unity} from 'apps/unity_dashboard/bootstrap'

export const unity = new class FakeUnity { // Fake unity class
  async constructor() {
    const unity = new Unity()
    // unity doesn't yet handle persistence,assume it's got some data in before we get to any uses/pages
    await load_data_into_unity()
    await fetch_unity_configuration()
    console.log('unity store should have data and configuration in now')
    return unity
  }
}

