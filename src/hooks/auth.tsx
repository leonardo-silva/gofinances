import React, { createContext, ReactNode, useContext, useState } from "react";

import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthorizationResponse {
    params: {
        access_token: string;       
    };
    type: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as IAuthContextData);

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User>({} as User);

    async function signInWithGoogle() {
        try {
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession
            .startAsync({ authUrl }) as AuthorizationResponse;

            if (type === 'success') {
                // Get user data
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userinfo = await response.json();

                setUser({
                    id: userinfo.id,
                    email: userinfo.email,
                    name: userinfo.given_name,
                    photo: userinfo.picture,
                });
                // console.log(userinfo);
            }
        } catch (error) {
            console.log(error);
            throw new Error("Erro de autenticaçao");
        }
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            signInWithGoogle 
        }}>
           { children }
        </AuthContext.Provider>  
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth }