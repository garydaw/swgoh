import { createContext, useEffect,useState } from "react";
import { apiRequest } from "../helpers/ApiRequest";
import { useAuth } from '../store/useAuth';

export const GlobalContext = createContext([]);


export const GlobalContextProvider = props => {
    const [units, setUnits] = useState([]);
    const [ships, setShips] = useState([]);
    const [allies, setAllies] = useState([]);
    
    const {isLoggedIn} = useAuth();


    useEffect(() => {
        const fetchGeneral = async () => {
            const general = await apiRequest('general', true, "GET");

            setUnits(general.units);
            setShips(general.ships);
            setAllies(general.allies);
        };

        if(isLoggedIn){
            fetchGeneral();
        }
    }, [isLoggedIn]);

    const getAllies = async () => {
        const allies = await apiRequest('general/allies', true, "GET");
        setAllies(allies);
    }

    function getUserName(ally_code) {
        const ally = allies.find(item => item.ally_code === parseInt(ally_code));

        // If the result is found, return the name; otherwise, return code back
        return ally ? ally.ally_name : ally_code;
    }

    return (
        <GlobalContext.Provider
            value={{
              units,
              ships,
              allies,
              getUserName,
              getAllies
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};
