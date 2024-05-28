import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserContext} from "../Store/user-context";

const AuthorizationWrapper = ({children, allowedPermissionLevels}) => {
    const navigate = useNavigate();
    const [text, setText] = useState(undefined);
    const {user} = useContext(UserContext);

    const permissionsCheck = () => {
        if (allowedPermissionLevels.length === 0 && user.permission !== '') {
            setText('We could not find this page for you! Redirecting to your account...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 4000);
        } else if (!allowedPermissionLevels.includes(user.permission)) {
            setText('You are not authorized to view this page! Use an account that has authorization to view this page! Redirecting to your account...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 4000);
        } else {
            setText(undefined);
        }
    }

    useEffect(permissionsCheck, [user, allowedPermissionLevels]);

    return (
        <>
            {text ? <h1>{text}</h1> : children}
        </>
    );
}

export default AuthorizationWrapper;