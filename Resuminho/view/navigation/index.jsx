import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { useAuthContext } from '../../viewmodel/context/AuthContext';
import AuthNavigator from './AuthNavigator';
import EstudanteNavigator from './EstudanteNavigator';
import RevisorNavigator from './RevisorNavigator';
import AdminNavigator from './AdminNavigator';

export default function RootNavigator() {
const { utilizador, carregando } = useAuthContext();

if (carregando) {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4b0073" />
    </View>
    );
}

return (
    <NavigationContainer>
    {!utilizador && <AuthNavigator />}
    {utilizador?.role === 'estudante' && <EstudanteNavigator />}
    {utilizador?.role === 'revisor' && <RevisorNavigator />}
    {utilizador?.role === 'admin' && <AdminNavigator />}
    </NavigationContainer>
);
}