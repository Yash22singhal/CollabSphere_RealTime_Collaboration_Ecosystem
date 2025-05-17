import { createContext, useEffect, useState } from "react";

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

    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      if (!token) return false;
      try {
        
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
      } catch (err) {
        return false;
      }
    };

    useEffect(()=>{
        async function loadData(){
            if (localStorage.getItem('token')){
                setToken(localStorage.getItem('token'));
            }
            await fetchUser(localStorage.getItem('token'))
        }
        isAuthenticated();
        loadData();
    }, [])

    const contextValue = {
        url,
        token,
        setToken,
        user,
        isAuthenticated,
      };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};
