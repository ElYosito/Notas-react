import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from './screens/inicioScreen';
import AgregarNotaScreen from './screens/agregarNota';
import EditarNotaScreen from './screens/editarNota';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inicio" component={InicioScreen} />
          <Stack.Screen name="AgregarNota" component={AgregarNotaScreen} />
          <Stack.Screen name="EditarNota" component={EditarNotaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
