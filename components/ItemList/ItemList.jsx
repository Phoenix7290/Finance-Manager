import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ItemList({ transaction }) {
  return (
    <View style={styles.card}>
      <Text style={styles.description}>{transaction.description}</Text>
      <Text style={styles.value}>{transaction.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
