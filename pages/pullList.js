import React, { useEffect, useContext } from "react";
import { PullContext } from "../contexts/pullContext";
import { View, Text, StyleSheet } from "react-native";
import { getPull } from "../apis/UserDatabaseApi";
import { FlatList } from "react-native-gesture-handler";

const PullList = () => {
  const [pull, updatePull] = useContext(PullContext);

  //On page Load update pull
  useEffect(() => {
    if (pull == false) {
      getPull().then((res) => {
        updatePull(res);
      });
    }
  }, [pull]);

  return (
    <View style={styles.container}>
      <FlatList
        data={pull}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
};

export default PullList;
const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    marginBottom: 100,
    marginHorizontal: 10,
  },
});
