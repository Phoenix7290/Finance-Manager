import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  Button,
  StyleSheet,
  Picker,
  TouchableOpacity,
  Text,
  Platform,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { listCurrency, getExchange } from '../../api';

export default function ModalForm({
  visivel,
  fecharModal,
  addTransactions,
  addCategory,
}) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [coin, setCoin] = useState('BRL');
  const [type, setType] = useState('Receita');
  const [category, setCategory] = useState('');
  const [dateHour, setDateHour] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [coins, setcoins] = useState([]);
  const [exchange, setExchange] = useState(null);

  useEffect(() => {
    const loadCoins = async () => {
      const moedasListadas = await listCurrency();
      setcoins(moedasListadas);
    };
    loadCoins();
  }, []);

  const saveTransactions = () => {
    addTransactions({
      id: Date.now(),
      description,
      value: parseFloat(value),
      coin,
      type,
      category,
      dateHour,
    });
    if (addCategory && category) {
      addCategory(category);
    }
    setDescription('');
    setValue('');
    setType('Receita');
    setCategory('');
    setDateHour(new Date());
    setExchange(null);
  };

  const showDatePickerTime = () => {
    setShowDatePicker(true);
  };

  const hideDateTimerPicker = () => {
    setShowDatePicker(false);
  };

  const aoAlterarDataHora = (_, selected) => {
    if (selected) {
      setDateHour(selected);
      hideDateTimerPicker();
    }
  };

  const searchExchange = async () => {
    const dateFormart = dateHour.toISOString().split('T')[0].split('-').reverse().join('-');
    const resultExchange = await getExchange(coin, dateFormart);
    setExchange(resultExchange ? resultExchange.exchangeBuy : 'Cotação indisponível');
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Categoria"
            value={category}
            onChangeText={setCategory}
          />
          <TouchableOpacity onPress={showDatePickerTime} style={styles.dateHourButton}>
            <Text style={styles.dateHourText}>
              {dateHour.toLocaleDateString()} {dateHour.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateHour}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={aoAlterarDataHora}
            />
          )}
          <Picker selectedValue={coin} style={styles.picker} onValueChange={setCoin}>
            {coins.map((item) => (
              <Picker.Item key={item.simbolo} label={item.nomeFormatado} value={item.simbolo} />
            ))}
          </Picker>
          <Button title="Buscar Cotação" onPress={searchExchange} />
          {exchange && <Text style={styles.exchangeText}>Cotação: {exchange}</Text>}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{type === 'Receita' ? 'Receita' : 'Despesa'}</Text>
            <Switch
              value={type === 'Receita'}
              onValueChange={() => setType((prev) => (prev === 'Receita' ? 'Despesa' : 'Receita'))}
              trackColor={{ false: '#ccc', true: '#007BFF' }}
              thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
            />
          </View>
          <Button title="Salvar" onPress={saveTransactions} color="#45b1f5" />
          <Button title="Cancelar" onPress={fecharModal} color="red" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  dateHourButton: {
    height: 50,
    backgroundColor: '#45b1f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateHourText: {
    color: 'white',
    fontSize: 16,
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  exchangeText: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
});
