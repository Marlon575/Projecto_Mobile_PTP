import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../../viewmodel/context/AuthContext';

import HomeEstudanteScreen from '../screens/estudante/HomeEstudanteScreen';
import PesquisarScreen from '../screens/estudante/PesquisarScreen';
import PerfilScreen from '../screens/estudante/PerfilScreen';

import HomeRevisorScreen from '../screens/revisor/HomeRevisorScreen';
import PublicarScreen from '../screens/revisor/PublicarScreen';
import AprovarScreen from '../screens/revisor/AprovarScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
const { utilizador } = useContext(AuthContext);
const eRevisor = utilizador?.role === 'revisor' || utilizador?.role === 'admin';

return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#73057d',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0.5,
        borderTopColor: '#E5E7EB',
        paddingBottom: 5,
        height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Pesquisar') {
            iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Publicar') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
        } else if (route.name === 'Aprovar') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
        },
    })}
    >
    {!eRevisor ? (
        <>
        <Tab.Screen name="Inicio" component={HomeEstudanteScreen} />
        <Tab.Screen name="Pesquisar" component={PesquisarScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
        </>
    ) : (
        <>
        <Tab.Screen name="Inicio" component={HomeRevisorScreen} />
        <Tab.Screen name="Publicar" component={PublicarScreen} />
        <Tab.Screen name="Aprovar" component={AprovarScreen} />
        </>
    )}
    </Tab.Navigator>
);
}