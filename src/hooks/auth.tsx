import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

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
    signInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
    storagedUserLoading: boolean;
}

export const AuthContext = createContext({} as IAuthContextData);

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User>({} as User);
    const [storagedUserLoading, setStoragedUserLoading] = useState(true);

    const userStorageKey = '@gofinances:user';

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

                const loggedUser = {
                    id: userinfo.id,
                    email: userinfo.email,
                    name: userinfo.given_name,
                    photo: userinfo.picture,
                }

                setUser(loggedUser);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(loggedUser));
                // console.log(userinfo);
            }
        } catch (error) {
            console.log(error);
            throw new Error("Erro de autenticaçao");
        }
    }

    async function signInWithApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            if (credential) {
                const name = credential.fullName!.givenName!;
                const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;
                
                const loggedUser = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo,
               } 
               setUser(loggedUser);
               await AsyncStorage.setItem(userStorageKey, JSON.stringify(loggedUser));
            }

        } catch (error) {
            console.log(error);
            throw new Error("Erro de autenticaçao");
        }
    }

    async function signOut() {
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey);
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const storagedUser = await AsyncStorage.getItem(userStorageKey);
            if (storagedUser) {
                const loggedUser = JSON.parse(storagedUser);
                setUser(loggedUser);
            }

            setStoragedUserLoading(false);
        }

        loadUserStorageData();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            signInWithGoogle, 
            signInWithApple,
            signOut,
            storagedUserLoading 
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