import React, { useReducer, createContext, useContext, useEffect } from 'react';
import { getSessionUser } from '../Components/Utils/authentication';

const initialState = {
    id: "",
    name: "",
    phone: "",
    birth: "",
    address: "",
    email: "",
    role: {
        id: 3,
        name: "CUSTOMER"
    }
};

// Reducer function để quản lý các thay đổi của user
const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                ...action.payload 
            };
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.field]: action.value 
            };
        case 'LOGOUT_USER':
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        const user = getSessionUser();
        if(user !== null) {
            dispatch({
              type: 'SET_USER',
              payload: user
            });
        }
    }, [])

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};
