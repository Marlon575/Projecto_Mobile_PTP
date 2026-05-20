//Stack  do  estudante
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TabNavigator from './TabNavigator';
// As tabs são o ecrã base do estudante

import DetalheResumoScreen from '../screens/estudante/DetalheResumoScreen';
// Abre por cima das tabs quando o estudante clica num resumo

const Stack = createStackNavigator ();


export default function EstudanteNavigator() {
    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

    <Stack.Screen
        name="EstudanteTabs"
        component={TabNavigator}
        // Este é o ecrã raiz as tabs ficam sempre por baixo
    />

    <Stack.Screen
        name="DetalheResumo"
        component={DetalheResumoScreen}
        // Para navegar para aqui de qualquer ecrã do estudante:
    />

    </Stack.Navigator>
);
}