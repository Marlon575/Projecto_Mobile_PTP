// Contexto global de autenticação
// Partilha os dados do utilizador com toda a app

import React, {createContext, use, useState} from "react";
// createContext — cria um "canal" de dados global
// useState — guarda o estado do utilizador em memória

export const AuthContext = createContext();
// AuthContext é o objecto que os outros ficheiros importam
// para ler os dados do utilizador com useContext(AuthContext)

export function AuthProvider ({childre}) {

    const [user, setUser] = useState(null);
    // user sempre começa por null= a niguem esta autenticado
    // Quando o utilizador fizer login, setUser recebe um objecto do utilizador

    const login = (UserData) =>{
        setUser(UserData);
        // Vai guardar os dados do utilizador a app indentifica e muda de navigador
    };

    const logout = () => {
        setUser(null);
        // Limpa os dados 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            { }
        {childre}
        </AuthContext.Provider>
    );

}