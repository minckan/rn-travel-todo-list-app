import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView,Alert } from 'react-native';
import { useState , useEffect} from 'react';
import { theme } from './color'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons'; 


const STORAGE_KEY_TODOS = '@todos'
const STORAGE_KEY_STATUS = '@status'

export default function App() {
  const [working, setWorking] = useState(true)
  const [text, setText] = useState('')
  const [todos, setTodos] = useState({})
  useEffect(() => {
    loadTodos()
    loadWorkingStatus()
  }, [])

  const travel = () => {
    setWorking(false)
    saveWorkingStatus(false)
  }
  const work = () => {
    setWorking(true)
    saveWorkingStatus(true)
  }
  const saveWorkingStatus = async (status) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_STATUS, String(status))
      console.log(String(status));
    } catch (e) {
      // saving error
      console.log(e);
    }
  }
  const loadWorkingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY_STATUS)
      console.log(Boolean(value));
      setWorking(Boolean(value))
    } catch (error) {
      
    }
  }
  const onChangeText = (event) => setText(event)
  const saveTodos = async (toSave) => {
    try {
      const jsonValue = JSON.stringify(toSave)
      await AsyncStorage.setItem(STORAGE_KEY_TODOS, jsonValue)
    } catch (e) {
      // saving error
    }
  }
  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
      setTodos(JSON.parse(jsonValue))
      
    } catch(e) {
      // error reading value
    }
  }

  const addTodo = async() => {
    if (text === '') {
      return
    }

    // save to do
    // const newTodos = Object.assign({}, todos, { [Date.now()]: { text, work: working } })
    const newTodos = { ...todos, [Date.now()]: { text, working } }
    setTodos(newTodos);
    await saveTodos(newTodos)
    setText('')
  }

  const deleteTodo = (key) => {
    Alert.alert('Delete To do', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: "I'm sure",
        style: 'destructive',
        onPress: async () => {
          const newTodos = { ...todos }
          delete newTodos[key]
          setTodos(newTodos);
          await saveTodos(newTodos)
      } }
    ])
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? 'white' : theme.gray}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? 'white' : theme.gray}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput
        placeholder={working ? 'Add a To Do' : 'Where do you want to go?'}
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        onSubmitEditing={addTodo}
        returnKeyType='done'
      ></TextInput>
      <ScrollView>
        {
          Object.keys(todos).map((key, idx) =>
            todos[key].working === working ? <View style={styles.todo} key={idx}>
              <Text style={styles.todoText}>{todos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Text><AntDesign name="closecircleo" size={24} color="white" /></Text>
              </TouchableOpacity>
          </View> : null)
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#000',
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    marginTop: 100,
    justifyContent: 'space-between',
    fontWeight: '500'

  },
  btnText: {
    color: 'white', 
    // color: theme.gray,
    fontSize: 44, fontWeight: '600'
  },
  input : {
    backgroundColor: 'white', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 18,
    marginVertical: 20,
  },
  todo: {
    backgroundColor: theme.todoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  todoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  }
});
