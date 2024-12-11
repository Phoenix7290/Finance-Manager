import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { listCoins, getExchange } from "../../api/exchange";
import BotaoAdicionar from "../../components/Button/Button";
import ModalTransacao from "../Modal/Modal";
import { Swipeable } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

export default function Home() {
  const [transaction, setTransaction] = useState([
    {
      id: 1,
      descricao: "Compra de supermercado",
      moeda: "BRL",
      tipo: "Despesa",
      value: 200.0,
      categoria: "Mercado",
      data: "2023-10-01T10:00:00Z",
    },
    {
      id: 2,
      descricao: "Venda de bicicleta",
      moeda: "USD",
      tipo: "Receita",
      value: 150.0,
      categoria: "Venda",
      data: "2023-10-02T14:00:00Z",
    },
    {
      id: 3,
      descricao: "Pagamento de condomínio",
      moeda: "BRL",
      tipo: "Despesa",
      value: 800.0,
      categoria: "Moradia",
      data: "2023-10-03T16:00:00Z",
    },
    {
      id: 4,
      descricao: "Compra de eletrônicos",
      moeda: "BRL",
      tipo: "Despesa",
      value: 1200.0,
      categoria: "Mercado",
      data: "2023-10-04T11:00:00Z",
    },
    {
      id: 5,
      descricao: "Venda de ações",
      moeda: "USD",
      tipo: "Receita",
      value: 300.0,
      categoria: "Venda",
      data: "2023-10-05T15:00:00Z",
    },
    {
      id: 6,
      descricao: "Pagamento de internet",
      moeda: "BRL",
      tipo: "Despesa",
      value: 100.0,
      categoria: "Moradia",
      data: "2023-10-06T09:00:00Z",
    },
    {
      id: 7,
      descricao: "Compra de roupas",
      moeda: "BRL",
      tipo: "Despesa",
      value: 400.0,
      categoria: "Mercado",
      data: "2023-10-07T13:00:00Z",
    },
    {
      id: 8,
      descricao: "Venda de carro",
      moeda: "USD",
      tipo: "Receita",
      value: 5000.0,
      categoria: "Venda",
      data: "2023-10-08T17:00:00Z",
    },
    {
      id: 9,
      descricao: "Pagamento de academia",
      moeda: "BRL",
      tipo: "Despesa",
      value: 200.0,
      categoria: "Moradia",
      data: "2023-10-09T08:00:00Z",
    },
    {
      id: 10,
      descricao: "Compra de livros",
      moeda: "BRL",
      tipo: "Despesa",
      value: 250.0,
      categoria: "Mercado",
      data: "2023-10-10T12:00:00Z",
    },
  ]);
  const [categories, setCategories] = useState(["Mercado", "Venda", "Moradia"]);
  const [avaliableCoins, setAvaliableCoins] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [transactionEditing, setTransacaoEditando] = useState(null);
  const [filter, setFilter] = useState("");
  const [ordination, setOrdination] = useState("");
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get("window");
      setIsPortrait(height >= width);
    };

    const subscription = Dimensions.addEventListener("change", updateLayout);
    return () => {
      subscription?.remove();
    };
  }, []);

  const adicionarCategoria = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const addTransactions = async (newTransaction) => {
    try {
      const { moeda, value } = newTransaction;

      // Converte valor se não for BRL
      if (moeda !== "BRL") {
        const dateNow = new Date()
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-");

        try {
          const exchange = await getExchange(moeda, dateNow);

          if (!exchange || !exchange.cotacaoCompra) {
            Alert.alert(
              "Erro de Conversão",
              `Não foi possível obter a cotação para a moeda ${moeda}. Usando valor original.`
            );
            return handleTransactionSave({
              ...newTransaction,
              valorOriginal: value,
              moedaOriginal: moeda,
            });
          }

          // Usa cotacaoCompra para conversão
          const valorConvertido = value * exchange.cotacaoCompra;

          return handleTransactionSave({
            ...newTransaction,
            value: valorConvertido,
            valorOriginal: value,
            moedaOriginal: moeda,
            cotacao: exchange.cotacaoCompra,
          });
        } catch (error) {
          console.error("Erro na cotação:", error);
          Alert.alert(
            "Erro de Cotação",
            `Problema ao buscar cotação para ${moeda}. Usando valor original.`
          );
          return handleTransactionSave(newTransaction);
        }
      }

      return handleTransactionSave(newTransaction);
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      Alert.alert("Erro", "Não foi possível adicionar a transação");
    }
  };

  const handleTransactionSave = (newTransaction) => {
    if (transactionEditing) {
      setTransaction(
        transaction.map((t) =>
          t.id === transactionEditing.id ? newTransaction : t
        )
      );
    } else {
      setTransaction([...transaction, newTransaction]);
    }

    setOpenModal(false);
    setTransacaoEditando(null);
  };

  const editarTransacao = (id) => {
    const transacaoParaEditar = transaction.find(
      (transacao) => transacao.id === id
    );
    if (transacaoParaEditar) {
      setTransacaoEditando(transacaoParaEditar);
      setOpenModal(true);
    }
  };

  const deletarTransacao = (id) => {
    setTransaction(transaction.filter((transacao) => transacao.id !== id));
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderLeftActions={() => (
        <TouchableOpacity
          style={styles.editbutton}
          onPress={() => editarTransacao(item.id)}
        >
          <Text style={styles.textButton}>Editar</Text>
        </TouchableOpacity>
      )}
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deletarTransacao(item.id)}
        >
          <Text style={styles.textButton}>Deletar</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.card}>
        <Text style={styles.cardDescricao}>{item.descricao}</Text>
        {isPortrait ? (
          <>
            <Text style={styles.cardInfo}>Categoria: {item.categoria}</Text>
            <Text style={styles.cardInfo}>
              Valor: R$ {item.value.toFixed(2)}
            </Text>
            <Text style={styles.cardInfo}>
              Data: {new Date(item.data).toLocaleDateString()}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.cardInfo}>Categoria: {item.categoria}</Text>
            <Text style={styles.cardInfo}>Moeda: {item.moeda}</Text>
            <Text style={styles.cardInfo}>Tipo: {item.tipo}</Text>
            <Text style={styles.cardInfo}>
              Hora: {new Date(item.data).toLocaleTimeString()}
            </Text>
            <Text style={styles.cardValue}>R$ {item.value.toFixed(2)}</Text>
          </>
        )}
      </View>
    </Swipeable>
  );

  const transacoesFiltradas = filter
    ? transaction.filter((transacao) => transacao.categoria === filter)
    : transaction;
  const transacoesOrdenadas =
    ordination === "Valor"
      ? transacoesFiltradas.sort((a, b) => a.value - b.value)
      : transacoesFiltradas;

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <Picker
          style={styles.picker}
          selectedValue={filter}
          onValueChange={(itemValue) => setFilter(itemValue)}
        >
          <Picker.Item label="Filtrar por Categoria" value="" />
          {categories.map((categoria) => (
            <Picker.Item key={categoria} label={categoria} value={categoria} />
          ))}
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={ordination}
          onValueChange={(itemValue) => setOrdination(itemValue)}
        >
          <Picker.Item label="Ordenar por" value="" />
          <Picker.Item label="Descrição" value="Descrição" />
          <Picker.Item label="Valor" value="Valor" />
        </Picker>
      </View>
      <FlatList
        data={transacoesOrdenadas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.flatList}
      />
      <View style={styles.footer}>
        <BotaoAdicionar onPress={() => setOpenModal(true)} />
      </View>
      <ModalTransacao
        visivel={openModal}
        fecharModal={() => setOpenModal(false)}
        addTransactions={addTransactions}
        adicionarCategoria={adicionarCategoria}
        avaliableCoins={avaliableCoins}
        transactionEditing={transactionEditing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
  },
  filters: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "90%",
    justifyContent: "space-between",
  },
  picker: {
    flex: 1,
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#fafafa",
  },
  flatList: { flex: 1, width: "90%" },
  scrollViewContent: { paddingBottom: 60 },
  card: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
  },
  cardDescricao: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  cardInfo: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
    textAlign: "center",
  },
  cardValue: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  swipeActions: { flexDirection: "row", alignItems: "center" },
  deleteButton: {
    backgroundColor: "#ff4d4f",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  editbutton: {
    backgroundColor: "#007BFF",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: { color: "#fff", fontSize: 16 },
  footer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
