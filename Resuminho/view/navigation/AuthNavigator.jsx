// Navigator para utilizadores que ainda não fizeram login
// Ecrãs disponíveis: Login e Registo

import React from "react";

import {createStackNavigator} from '@react-navigation/stack';
// createStackNavigator — cria navegação em pilha
// Cada ecrã novo empilha por cima do anterior
// Exemplo: Login → pressiona "Criar conta" → Registo aparece por cima

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
//Criado pelo  colega.....

const Stack = createStackNavigator();

export default function AuthNavigator(){
    return(
        <Stack.Navigator
        initialRouteName="Login" // Define o primeiro ecra que aparece na tela
        screenOptions={{
            headerShown: false,
        }}
        >
            <Stack.Screen
            name="Login"
            component={LoginScreen}
            />

            <Stack.Screen
            name="Register"
            component={RegisterScreen}
            />
        </Stack.Navigator>
    );
}
