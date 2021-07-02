import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { login, reg } from '../apis/UserDatabaseApi'
import { useAppDispatch } from '../redux/hooks'
import { logedTrue } from '../redux/reducers/logedIn'

const Login = () => {
  const dispatch = useAppDispatch()
  const [username, updateUsername] = useState('')
  const [password, updatePassword] = useState('')
  const [passwordR, updatePasswordR] = useState('')
  const [email, updateEmail] = useState('')
  const [formState, updateFormState] = useState('login')

  //Logs user in
  const loginHandler = async () => {
    const checkLoged = await login(username, password)
    if (checkLoged) {
      dispatch(logedTrue())
    } else {
      alert('Username or Password was incorrect')
    }
  }

  //Registers user
  const regHandler = async () => {
    if (password !== passwordR) {
      alert('Passwords do no match')
    } else {
      reg(username, password, passwordR, email)
    }
  }

  return (
    <View style={styles.container}>
      {/* Switch bewtten login form and register form*/}
      <View style={styles.switchView}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            {
              backgroundColor:
                formState == 'login' ? '#3F51B5' : 'rgba(88, 89, 88 , 0.4)'
            }
          ]}
          onPress={() => {
            updateFormState('register')
          }}
        >
          <Text
            onPress={() => {
              updateFormState('login')
            }}
            style={[styles.switchText]}
          >
            Login
          </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={[
              styles.switchButton,
              {
                backgroundColor:
                  formState == 'register' ? '#3F51B5' : 'rgba(88, 89, 88 , 0.5)'
              }
            ]}
            onPress={() => {
              updateFormState('register')
            }}
          >
            <Text style={styles.switchText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      {formState == 'login' ? (
        <View style={styles.form}>
          <Text style={styles.heading}>Login </Text>
          <Text>Username</Text>
          <TextInput
            onChangeText={(text) => {
              updateUsername(text)
            }}
            style={styles.textInput}
            autoCompleteType={'username'}
          />
          <Text>Password</Text>
          <TextInput
            onChangeText={(text) => {
              updatePassword(text)
            }}
            style={styles.textInput}
            autoCompleteType={'password'}
          />
          <TouchableOpacity
            style={styles.filterSubmit}
            title="Login"
            onPress={() => {
              loginHandler()
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.heading}>Register </Text>
          <Text>Username</Text>
          <TextInput
            onChangeText={(text) => {
              updateUsername(text)
            }}
            style={styles.textInput}
            autoCompleteType={'username'}
          />
          <Text>Password</Text>
          <TextInput
            onChangeText={(text) => {
              updatePassword(text)
            }}
            style={styles.textInput}
            autoCompleteType={'password'}
          />
          <Text>Password Repeat</Text>
          <TextInput
            onChangeText={(text) => {
              updatePasswordR(text)
            }}
            style={styles.textInput}
            autoCompleteType={'password'}
          />
          <Text>Email</Text>
          <TextInput
            onChangeText={(text) => {
              updateEmail(text)
            }}
            style={styles.textInput}
            autoCompleteType={'password'}
          />
          <TouchableOpacity
            style={styles.filterSubmit}
            title="Register"
            onPress={() => {
              regHandler()
            }}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default Login
const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 250,
    borderWidth: 1,
    backgroundColor: '#3F51B5',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff'
  },
  textInput: {
    backgroundColor: '#e1e6e4',
    width: 150,
    borderWidth: 1,
    borderColor: '#e1e6e4',
    borderRadius: 10,
    paddingHorizontal: 10
  },
  filterSubmit: {
    backgroundColor: '#FFFF',
    width: 100,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3F51B5',
    marginBottom: 10
  },
  buttonText: {
    fontSize: 20
  },
  heading: {
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 10
  },
  switchView: {
    flexDirection: 'row',
    marginBottom: 50
  },
  switchText: {
    marginHorizontal: 30,
    fontSize: 30
  },
  switchButton: {
    borderColor: 'orange',
    borderWidth: 1
  }
})
