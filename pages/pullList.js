import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getPullListAsync, getPullListState } from "../redux/reducers/pullList";
import { Icon } from "react-native-elements";
import { removePullList } from "../apis/UserDatabaseApi";
import { Dimensions } from "react-native";
const { height } = Dimensions.get("window");

const PullList = () => {
  const pull = useAppSelector(getPullListState);
  const fontSize = (5 * height) / 200;
  const dispatch = useAppDispatch();

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
      alert("Am error occured");
    }
  };

  if (pull.length === 0) {
    return (
      <>
        <View style={styles.altScreen}>
          <Text style={{ fontSize: 30, alignSelf: "center" }}>
            No Comics in Pull List
          </Text>
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40, marginBottom: 25 }}> Your Pull List</Text>
      <FlatList
        data={pull}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 26,
                justifyContent: "space-between",
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{ fontSize: fontSize, minWidth: "70%", maxWidth: "90%" }}
              >
                {item}
              </Text>
              <Icon
                name="delete-forever"
                type="material"
                size={fontSize * 2}
                color="red"
                onPress={() => {
                  removeFromPull(item);
                }}
              />
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
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  altScreen: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
});
