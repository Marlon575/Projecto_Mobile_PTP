// Stack do admin — sem tabs, acesso directo a todas as funções de gestão

import React from "react";
import {createStackNavigator} from '@react-navigation/stack';

import DashboardAdminScreen from '../screens/admin/DashboardAdminScreen';
import GerirUtilizadoresScreen from '../screens/admin/GerirUtilizadoresScreen';
import GerirCursosScreen from '../screens/admin/GerirCursosScreen';
import NomearRevisorScreen from '../screens/admin/NomearRevisorScreen';


const Stack = createStackNavigator();

export default function AdminNavigator() {
    return (
    <Stack.Navigator
    initialRouteName="Dashboard"
    screenOptions={{ headerShown: false }}
    >

    <Stack.Screen
        name="Dashboard"
        component={DashboardAdminScreen}
        // Primeiro ecrã que o admin vê quando entrar
    />

    <Stack.Screen
        name="GerirUtilizadores"
        component={GerirUtilizadoresScreen}
    />

    <Stack.Screen
        name="GerirCursos"
        component={GerirCursosScreen}

    />

    <Stack.Screen
        name="NomearRevisor"
        component={NomearRevisorScreen}

    />

    </Stack.Navigator>
    );
}