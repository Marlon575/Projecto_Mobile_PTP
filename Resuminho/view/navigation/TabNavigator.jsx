// Barra de tabs na parte inferior do ecrã
// Adapta-se automaticamente ao tipo de utilizador estudante ou revisor

import React, {use, useContext} from "react";

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
//Cria a barra de navegacao na parte de baixo do ecra

import {Ionicons} from '@expo/vector-icons';
// Ionicons — biblioteca de ícones do Expo

import{AuthContext} from '../../viewmodel/context/AuthContext';

//Ecra do estudante
import homeEstudanteScreen from '../screens/estudante/HomeEstudantesScreen';
import PesquisarScreen from '../screens/estudante/PesquisarScreen';
import PerfilScreen from '../screens/estudante/PerfilScreen';

//Ecras do revisor
import HomeRevisorScreen from '../screens/revisor/HomeRevisorScreen';
import PublicarScreen from '../screens/revisor/PublicarScreen';
import AprovarScreen from '../screens/revisor/AprovarScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {

const { user } = useContext(AuthContext);

    return (
    <Tab.Navigator
    screenOptions={({ route }) => ({

        headerShown: false,

        tabBarActiveTintColor: '#2563EB',
        // Cor do ícone e texto quando a tab está seleccionada 

        tabBarInactiveTintColor: '#9CA3AF',
        // Cor quando a tab não está seleccionada 

        tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0.5,
        borderTopColor: '#E5E7EB',
        paddingBottom: 5,
        height: 60,
        },

        tabBarIcon: ({ focused, color, size }) => {
          // focused — true se esta tab estiver activa
          // color — recebe automaticamente activeTintColor ou inactiveTintColor
          // size — tamanho padrão do ícone definida em React Navigation

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
    {user?.tipo === 'estudante' ? (
        
        <>
        <Tab.Screen name="Inicio" component={HomeEstudanteScreen} />
        <Tab.Screen name="Pesquisar" component={PesquisarScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
        </>
    ) : (
        // Se não for estudante é revisor  mostra estas 3 tabs
        <>
        <Tab.Screen name="Inicio" component={HomeRevisorScreen} />
        <Tab.Screen name="Publicar" component={PublicarScreen} />
        <Tab.Screen name="Aprovar" component={AprovarScreen} />
        </>
    )}
    </Tab.Navigator>
);
}