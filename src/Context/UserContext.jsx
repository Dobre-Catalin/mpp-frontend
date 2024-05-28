import React, {createContext, useState} from 'react';

const UserContext = createContext({username: '', token: ''});

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        username:'',
        token:'',
    });

    const updateUser = (newUser) =>{
        console.log(newUser);
        setUser(newUser);
    };

    const logout = () => {
        setUser({
            username: '',
            token: '',
        });
        sessionStorage.clear();
        navigate('/signin');
    }

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider, UserContext };