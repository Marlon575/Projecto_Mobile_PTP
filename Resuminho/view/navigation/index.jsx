// Este é o navigator raiz — decide qual navigator mostrar
import React, {useContext} from 'react';
// useContext — permite ler dados do AuthContext ( AS sessãos do utilizador)
import {NavigationContainer} from '@react-navigation/native';
// Só pode existir UM na app inteira — fica aqui no topo

import {AuthContext} from '../../viewmodel/context/AuthContext'
// AuthContext guarda os dados do utilizador que entrou na sessão

import AuthNavigador from './AuthNavigator';
// Navigator para utilizadores NÃO autenticados (Login, Registo)

import EstudanteNavigator from './EstudanteNavigator';
import RevisorNavigator from './RevisorNavigator';
import AdminNavigator from './AdminNavigator';
import AuthNavigator from './AuthNavigator';

export default function RootNavigator(){
    const {user} = useContext(AuthContext);
    // Lê o objecto user do contexto
  // user tem a forma: { _id, nome, email, tipo }
  // tipo pode ser: 'estudante', 'revisor' ou 'admin'
return (
    <NavigationContainer>
        {/* Tudo dentro daqui é gerido pelo sistema de navegação */}

        {!user && <AuthNavigator />}
        {/* Se não há user — mostra Login/Registo */}

        {user?.tipo === 'estudante' && <EstudanteNavigator/>}

        {user?.tipo === 'revisor' && <RevisorNavigator/>}

        {user?.tipo === 'admim' && <AuthNavigador/>}
    </NavigationContainer>
);

}