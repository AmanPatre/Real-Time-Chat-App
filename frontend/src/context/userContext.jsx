import React, { useState } from 'react'
import { createContext , useContext } from 'react'

const UserContext = createContext();

export const UserProvider =({children})=>{

    const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

   const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  
    return (
        <UserContext.Provider value={{user, setUser , token , setToken}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser=()=>{
    return useContext(UserContext);
}