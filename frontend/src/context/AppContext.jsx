import { createContext, useEffect, useId, useState } from "react";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
    //const url = "http://localhost:5000"
    const url = "https://collabsphere-realtime-collaboration.onrender.com";
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});

    const fetchUser = async (token) => {
        if (!token) return;
        const userId = localStorage.getItem('userId');
        try{
            const response = await fetch(`${url}/api/auth/user/${userId}`,{
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = await response.json();

            if (response.ok){
                setUser(userData);
            }

        } catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        async function loadData(){
            if (localStorage.getItem('token')){
                setToken(localStorage.getItem('token'));
            }
            await fetchUser(localStorage.getItem('token'))
        }
        loadData();
    }, [])

    const contextValue = {
        url,
        token,
        setToken,
        user
      };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};
