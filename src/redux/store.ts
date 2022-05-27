import Reducer from "./Reducer"
import { createStore } from "redux"

const saveToLocalStorage = (state: any) => {
    try {
      sessionStorage.setItem('state', JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  };
  
const loadFromLocalStorage = () => {
    try {
      const stateStr = sessionStorage.getItem('state');
      return stateStr ? JSON.parse(stateStr) : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

const persistedStore = loadFromLocalStorage();
export const store = createStore(Reducer, persistedStore);
store.subscribe(() => {
    saveToLocalStorage(store.getState());
  });

export type RootState = ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch


