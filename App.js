import {StatusBar} from 'expo-status-bar';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import RootNavigador from './view/navigation/index';
export default function App (){
    return(
        <GestureHandlerRootView style={{flex:1}}>
        <AuthProvider>
            <StatusBar style="auto"/>
            <RootNavigador/>
            </AuthProvider>
        </GestureHandlerRootView>
    )
}