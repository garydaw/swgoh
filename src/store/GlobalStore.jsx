import { createContext, useEffect,useState } from "react";
import { apiRequest } from "../helpers/ApiRequest";
import { useAuth } from '../store/useAuth';

export const GlobalContext = createContext([]);

export const GlobalContextProvider = props => {
    const [units, setUnits] = useState([]);
    const [ships, setShips] = useState([]);
    const [allies, setAllies] = useState([])
    
    const {isLoggedIn} = useAuth();


    useEffect(() => {
        const fetchGeneral = async () => {
            const general = await apiRequest('general', 'GET');

            setUnits(general.units);
            setShips(general.ships);
            setAllies(general.allies);
        };

        if(isLoggedIn){
            fetchGeneral();
        }
    }, [isLoggedIn]);

    return (
        <GlobalContext.Provider
            value={{
              units,
              ships,
              allies
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};
