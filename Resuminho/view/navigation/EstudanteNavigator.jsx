import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TabNavigator from './TabNavigator';
import DetalheResumoScreen from '../screens/estudante/DetalheResumoScreen';
import PublicarResumoScreen from '../screens/revisao/PublicarResumoScreen';

const Stack = createStackNavigator();

export default function EstudanteNavigator() {
return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EstudanteTabs" component={TabNavigator} />
    <Stack.Screen name="DetalheResumo" component={DetalheResumoScreen} />
    <Stack.Screen name="PublicarResumo" component={PublicarResumoScreen} />
    </Stack.Navigator>
);
}