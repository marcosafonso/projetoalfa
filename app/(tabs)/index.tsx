import { Text,Image,
        Platform, View,
        Button, TextInput,
        Pressable, FlatList,
        StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen() {

  // const [text, onChangeText] = React.useState('')
  // const [number, onChangeNumber] = React.useState('');

  const [data, setData] = React.useState<any>([]); // Dados da lista
  const [input, setInput] = React.useState(''); // Entrada de texto

  const addItem = () => {
    if (input.trim()){
      setData([...data, {id: Date.now().toString(), value: input, done: false}]);
    }
    setInput("");
    saveData();
  }

  const finishItem = (id:any) => {
    //setData(data.filter((item:any) => item.id !== id));
    setData(data.map((item:any) => (item.id === id ? {...item, done: true}: item )))
  }

  const updateItem = (id:any, newValue:any) => {
    setData(data.map((item:any) => (item.id === id ? {...item, value: newValue}: item )));
  }

  //AsyncStorage
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('crudData', JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  };

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('crudData');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
     } catch (e) {
        console.log(e);
      }
    }
  
    useEffect(() => {
      loadData();
    },[]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={input}
        onChangeText={setInput}
      />

      {/* <Button title="Adicionar" onPress={addItem}/> */}
      <TouchableOpacity style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList 
        data={data}
        renderItem={({item}) => (
          <View style={item.done? styles.itemDone: styles.item}>
            <TouchableOpacity onLongPress={()=> finishItem(item.id)}>
              <Text style={{fontSize: 16}}>{item.value}</Text>  
            </TouchableOpacity>
          </View>  
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    paddingTop:100,
    backgroundColor: "#ffbd00",
  },
  input: {
    borderWidth: 1,
    borderColor: "#f4d35e",
    backgroundColor: "#faf0ca",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
  },
  itemDone: {
    padding: 10,
    textDecorationLine: 'line-through',
    borderBottomWidth: 1,
  },
  button: {
    borderRadius: 5,
    backgroundColor: "#390099",
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonDel: {
    borderRadius: 5,
    backgroundColor: "#ff6f69",
    padding: 10,
    alignItems: 'center',
  }
});