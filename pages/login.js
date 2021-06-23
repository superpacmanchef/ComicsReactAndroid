import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { login } from "../apis/UserDatabaseApi";
import { useAppDispatch } from "../redux/hooks";
import { logedTrue } from "../redux/reducers/logedIn";

const Login = () => {
  const dispatch = useAppDispatch();
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");

  //Logs user in
  const loginHandler = async () => {
    const checkLoged = await login(username, password);
    if (checkLoged) {
      dispatch(logedTrue());
    } else {
      alert("NAHHH FUCKED IT");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Login </Text>
        <Text>Username</Text>
        <TextInput
          onChangeText={(text) => {
            updateUsername(text);
          }}
          style={styles.textInput}
          autoCompleteType={"username"}
        />
        <Text>Password</Text>
        <TextInput
          onChangeText={(text) => {
            updatePassword(text);
          }}
          style={styles.textInput}
          autoCompleteType={"password"}
        />
        <TouchableOpacity
          style={styles.filterSubmit}
          title="Login"
          onPress={() => {
            loginHandler();
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: 250,
    borderWidth: 1,
    backgroundColor: "rgb(0, 194, 128)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
  },
  textInput: {
    backgroundColor: "#e1e6e4",
    width: 150,
    borderWidth: 1,
    borderColor: "#e1e6e4",
    borderRadius: 10,
  },
  filterSubmit: {
    backgroundColor: "#FFFF",
    width: 100,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgb(0, 194, 128)",
  },
  buttonText: {
    fontSize: 20,
  },
  heading: {
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
});
