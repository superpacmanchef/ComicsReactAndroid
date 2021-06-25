import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getPullListAsync, getPullListState } from "../redux/reducers/pullList";
import { Icon } from "react-native-elements";
import { removePullList } from "../apis/UserDatabaseApi";

const PullList = () => {
  const pull = useAppSelector(getPullListState);
  const dispatch = useAppDispatch();

  //On page Load update pull
  useEffect(() => {
    if (pull != []) {
      dispatch(getPullListAsync());
    }
  }, []);

  const removeFromPull = async (title) => {
    const pullRes = await removePullList(title);
    if (pullRes) {
      alert("Removed from PullList");
      dispatch(getPullListAsync());
    } else {
      alert("Error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize : 20 , marginBottom : 30}}> Your Pull List</Text>
      <FlatList
        data={pull}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <>
            <View style={{ flexDirection: "row", flexWrap: "wrap" , marginBottom : 15  }}>
              <Text style={{ minWidth: "50%" , alignSelf : "center" }}>{item}</Text>
              <Icon
                name="delete-forever"
                type="material"
                size={30}
                color="red"
                onPress={() => {
                  removeFromPull(item);
                }}
              ></Icon>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default PullList;
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10, 
    justifyContent : "center",
    alignContent : "center",
    alignItems : "center"
  },

});
