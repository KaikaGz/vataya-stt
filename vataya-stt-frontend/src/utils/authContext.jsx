import React from 'react'
import {
    Routes,
    Route,
    NavLink,
    useNavigate,
  } from 'react-router-dom';

  const AuthContext = React.createContext({token:"12345"});
  
  const AuthProvider = ({ children }) => {
  
    const [token, setToken] = React.useState({token:"1234"});
  
    return (
      <AuthContext.Provider value={token}>
        {children}
      </AuthContext.Provider>
    );
  };

  export default AuthProvider