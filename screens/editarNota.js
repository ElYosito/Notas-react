import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import TipoNotaSelect from '../components/tipoNota';
import * as ImagePicker from 'expo-image-picker';

export default function EditarNotaScreen({ navigation, route }) {
  const { nota } = route.params;
  const [titulo, setTitulo] = useState(nota.titulo);
  const [contenido, setContenido] = useState(nota.contenido);
  const [tipo, setTipo] = useState(nota.tipo);
  const [imagen, setImagen] = useState(nota.imagen || null);
  const [alturaContenido, setAlturaContenido] = useState(120);
  const [guardando, setGuardando] = useState(false);

  const estaVacio = titulo.trim() === '' && contenido.trim() === '' && !imagen && tipo === 'Tipo de nota';

  const guardarCambios = async () => {
    try {
      const notasGuardadas = await AsyncStorage.getItem('notas');
      let notas = notasGuardadas ? JSON.parse(notasGuardadas) : [];

      notas = notas.map((n) => {
        if (n.id === nota.id) {
          return {
            ...n,
            titulo,
            contenido,
            tipo,
            imagen,
          };
        }
        return n;
      });

      await AsyncStorage.setItem('notas', JSON.stringify(notas));
      console.log('Nota actualizada');
      navigation.goBack();
    } catch (error) {
      console.error('Error actualizando nota:', error);
    }
  };

  return (
    <View className="flex-1 bg-[#242323] pt-12 pb-4">
      <View className="flex-row items-center justify-between px-4 mb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="white" size={45} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white ml-2">Editar Nota</Text>
        </View>

        <TouchableOpacity
          className={`px-4 py-2 rounded-xl ${estaVacio ? 'bg-gray-400' : 'bg-yellow-300'}`}
          disabled={estaVacio}
          onPress={async () => {
            setGuardando(true);
            await guardarCambios();
            setGuardando(false);
          }}
        >
          <Text className="text-black font-medium text-lg">
            {guardando ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center gap-3 mb-3">
          <TextInput
            className="bg-white rounded-xl p-3 text-lg text-black flex-1"
            placeholder="Título"
            placeholderTextColor="#888"
            value={titulo}
            onChangeText={setTitulo}
          />

          <View className="w-52">
            <TipoNotaSelect value={tipo} onValueChange={setTipo} />
          </View>
        </View>

        <View className="flex-row justify-between items-end mb-4">
          <TouchableOpacity
            className="bg-red-400 px-4 py-2 rounded-xl"
            onPress={() => {
              setTitulo('');
              setContenido('');
              setTipo('Tipo de nota');
              setImagen(null);
            }}
          >
            <Text>Limpiar nota</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white px-4 py-2 rounded-xl"
            onPress={async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });

              if (!result.canceled) {
                setImagen(result.assets[0].uri);
              }
            }}
          >
            <Text className="text-black">Cambiar imagen</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-xl p-3">
          {imagen && (
            <Image
              source={{ uri: imagen }}
              className="w-full h-48 mb-3 rounded-xl"
              resizeMode="cover"
            />
          )}

          <TextInput
            placeholder="Contenido..."
            placeholderTextColor="#aaa"
            value={contenido}
            onChangeText={setContenido}
            multiline
            onContentSizeChange={(e) =>
              setAlturaContenido(e.nativeEvent.contentSize.height)
            }
            style={{
              minHeight: 120,
              height: Math.max(120, alturaContenido),
              textAlignVertical: 'top',
              fontSize: 16,
              color: '#000',
            }}
          />

          <Text className="text-right text-gray-500 text-xs mt-1">
            {contenido.length} caracteres
          </Text>
        </View>
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}
