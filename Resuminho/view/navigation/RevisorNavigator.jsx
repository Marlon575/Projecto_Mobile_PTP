// Stack do revisor

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TabNavigator from './TabNavigator';

import DetalheResumoScreen from '../screens/estudante/DetalheResumoScreen';
// O revisor também pode ver o detalhe de um resumo

import AvaliarResumoScreen from '../screens/revisor/AvaliarResumoScreen';
// Ecrã exclusivo do revisor com o formulário para aprovar ou rejeitar

const Stack = createStackNavigator();

export default function RevisorNavigator() {
    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

    <Stack.Screen
        name="RevisorTabs"
        component={TabNavigator}
    />

    <Stack.Screen
        name="DetalheResumo"
        component={DetalheResumoScreen}
    />

    <Stack.Screen
        name="AvaliarResumo"
        component={AvaliarResumoScreen}
        
    />

    </Stack.Navigator>
);
}