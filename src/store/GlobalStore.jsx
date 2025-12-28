import { createContext, useEffect,useState } from "react";
import { apiRequest } from "../helpers/ApiRequest";
import { useAuth } from '../store/useAuth';

export const GlobalContext = createContext([]);


export const GlobalContextProvider = props => {
    const [units, setUnits] = useState([]);
    const [ships, setShips] = useState([]);
    const [allies, setAllies] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    
    const {isLoggedIn} = useAuth();


    useEffect(() => {
        const fetchGeneral = async () => {
            const general = await apiRequest('general', true, "GET");

            setUnits(general.units);
            setShips(general.ships);
            setAllies(general.allies);
            setLastUpdated(general.lastUpdated);
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

    function getLastUpdated() {
        const date = new Date(lastUpdated);

        const day = date.getDate();
        const month = date.toLocaleString('en-GB', { month: 'short' });
        const year = date.getFullYear();

        const ordinal = (n) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
            }
        };

        return `${day}${ordinal(day)} ${month} ${year}`;
    }

    return (
        <GlobalContext.Provider
            value={{
              units,
              ships,
              allies,
              lastUpdated,
              getUserName,
              getAllies,
              getLastUpdated
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};
