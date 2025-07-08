import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function TipoNotaSelect({ value, onValueChange }) {
  return (
    <View className="bg-white rounded-xl overflow-hidden">
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={{
          height: 55,
          color: 'black',
        }}
        dropdownIconColor="black"
      >
        <Picker.Item label="Tipo de nota" value="Tipo de nota" />
        <Picker.Item label="Liga Yeshua" value="Liga Yeshua" />
        <Picker.Item label="Administradores" value="Administradores" />
        <Picker.Item label="Desarrollador" value="Desarrollador" />
        <Picker.Item label="Personal" value="Personal" />
      </Picker>
    </View>
  );
}
