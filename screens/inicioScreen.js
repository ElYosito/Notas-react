import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Plus, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

export default function InicioScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [notas, setNotas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      cargarNotas();
    }, [])
  );

  const cargarNotas = async () => {
    try {
      const notasGuardadas = await AsyncStorage.getItem('notas');
      if (notasGuardadas) {
        setNotas(JSON.parse(notasGuardadas));
      } else {
        setNotas([]);
      }
    } catch (error) {
      console.error('Error cargando notas:', error);
    }
  };

  const eliminarNota = async (id) => {
    try {
      const nuevasNotas = notas.filter((nota) => nota.id !== id);
      setNotas(nuevasNotas);
      await AsyncStorage.setItem('notas', JSON.stringify(nuevasNotas));
    } catch (error) {
      console.error('Error eliminando nota:', error);
    }
  };

  const renderRightActions = (progress, dragX, itemId) => {
    return (
      <View style={{ width: 80, height: '85%' }}>
        <TouchableOpacity
          className="bg-red-500 justify-center items-center h-full rounded-xl"
          onPress={() => eliminarNota(itemId)}
        >
          <Trash2 color="white" size={28} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item.id)
      }
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('EditarNota', { nota: item })}
      >
        <View className="bg-[#fffbd0] rounded-xl p-3 mb-3 shadow-sm">
          <Text className="text-black text-xl font-semibold">
            {item.titulo} - {item.fecha}
          </Text>
          <Text className="text-black text-sm mt-1">{item.tipo}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View className="flex-1 bg-[#242323] px-4 pt-12 pb-4">
      <Text className="text-3xl font-bold text-white mb-2">Notas</Text>

      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text className="text-white mt-4 text-center">
            No hay notas guardadas.
          </Text>
        }
      />

      <TouchableOpacity
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-slate-200 p-3 rounded-full shadow-md z-10"
        onPress={() => navigation.navigate('AgregarNota')}
      >
        <Plus color="black" size={40} />
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}
