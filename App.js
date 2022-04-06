import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView,Alert } from 'react-native';
import { useState, useEffect } from 'react';
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
      const jsonValue = JSON.stringify({status})
      await AsyncStorage.setItem(STORAGE_KEY_STATUS, jsonValue)
    } catch (e) {
      // saving error
      console.log(e);
    }
  }
  const loadWorkingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY_STATUS)
      const { status } = JSON.parse(value)
      setWorking(status)
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
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_TODOS)
      setTodos(JSON.parse(jsonValue))
      // setTodos({})
    } catch(e) {
      // error reading value
      console.log(e);
    }
  }

  const addTodo = async() => {
    if (text === '') {
      return
    }

    // save to do
    // const newTodos = Object.assign({}, todos, { [Date.now()]: { text, work: working } })
    const newTodos = { ...todos, [Date.now()]: { text, working, completed: false, editable: false } }
    console.log(newTodos);
    setTodos(newTodos);
    await saveTodos(newTodos)
    setText('')
  }

  const checkCompleted = (key) => {
    const newTodos = { ...todos }
    newTodos[key].completed = !newTodos[key].completed
    setTodos(newTodos)
  }
  const doEdit = (key) => {
    const newTodos = { ...todos }
    newTodos[key].editable = true
    setTodos(newTodos)
  }
  
  const handleEdit = (key) => {
    const newTodos = { ...todos }
    newTodos[key].text = true
    setTodos(newTodos)
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
              <View style={styles.flexRow}>
                <TouchableOpacity onPress={() => checkCompleted(key)} >
                  <AntDesign name="checkcircle" size={24} color={todos[key].completed ? 'red' : 'grey'} />
                </TouchableOpacity>
                {
                  todos[key].editable
                  ? <TextInput value={todos[key].text} style={styles.todoText}></TextInput>
                  : <Text style={styles.todoText}>{todos[key].text}</Text>
                }
                
              </View>
              <View style={styles.flexRow}>
                <TouchableOpacity onPress={() => doEdit(key)}>
                  <AntDesign name="edit" size={24} color="white" style={ styles.edit}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <Text><AntDesign name="closecircleo" size={24} color="white" /></Text>
                </TouchableOpacity>
              </View>
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
    fontWeight: '500',
    marginLeft: 20
  },
  flexRow: {
    flexDirection: 'row', 
    alignItems:'center'
  },
  edit: {
    marginRight: 15
  }
});
