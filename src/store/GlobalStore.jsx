import { createContext, useContext, useReducer } from "react";

export const ACTIONS = {
  UPDATE_ALLY_CODE: "update-ally_code"
}

export function globalReducer(state, action){
  
  switch(action.type){
    case ACTIONS.UPDATE_ALLY_CODE:
      return {
          ...state,
          ally_code: action.payload
      }
  }
  
  return state;
}

export const GlobalContext = createContext();;


export function GlobalProvider(props){

  const [state, dispatch] = useReducer(globalReducer, {
    ally_code: ''
  });

  return (
    <GlobalContext.Provider {...props} value={{state, dispatch}}></GlobalContext.Provider>
  )
}
export function useGlobalContext(){
  return useContext(GlobalContext);
}

