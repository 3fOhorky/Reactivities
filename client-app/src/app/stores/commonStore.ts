import { RootStore } from "./rootStore";
import { observable, action, reaction } from "mobx";

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    
    reaction(
        // reaction runs every time the variable changes (u ovom slučaju token)
        () => this.token,  // varijabla
        token => {         // naredba koja se izvrši
            if (token) {
                window.localStorage.setItem('jwt', token);
            } else {
                window.localStorage.removeItem('jwt');
            }
        }
    )
  }

  @observable token: string | null = window.localStorage.getItem('jwt');
  @observable appLoaded = false;

  @action setToken = (token: string | null) => {
      this.token = token;
  }

  @action setAppLoaded = () => {
      this.appLoaded = true;
  }
}
