import React, { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, View, Image, ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import LogedContext from "../contexts/logedContext";
import { comicTitleSplit } from "../utils/comicDataProcessesing";
import { PullContext } from "../contexts/pullContext";
import { getPull } from "../apis/UserDatabaseApi";

const Comics = (props) => {
  const { comics, comicsPressHandler } = props;

  const [loged] = useContext(LogedContext);
  const [pulledArr, updatePulledArr] = useState([]);
  const [pull, updatePull] = useContext(PullContext);

  //On comics load check - user logged in - if comics are on pull list
  useEffect(() => {
    if (loged) {
      if (pull == false) {
        getPull().then((res) => {
          updatePull(res);
        });
        const t = checkPull(pull);
        updatePulledArr(t);
      }
    }
  }, [comics, pull]);

  //Check if comics are on pull list
  //Returns T/F array
  const checkPull = () => {
    const arr = [];
    if (loged && comics) {
      comics.forEach((comic, index) => {
        //Tests if pullList exists and is populated
        if (pull) {
          //Tests every comic.name in list against pullList
          //if true sets pulled to true
          for (let x = 0; x < pull.length; x++) {
            let [name] = comicTitleSplit(comic.title);
            if (name) {
              name = name.replace(/AND /g, "");
              let strippedPull = pull[x];
              if (strippedPull === name) {
                console.log(name);
                console.log(strippedPull);
                arr[index] = true;
                break;
              } else {
                arr[index] = false;
              }
            }
          }
        }
      });
    }
    return arr;
  };

  return (
    <View>
      <FlatList
        numColumns={2}
        data={comics}
        keyExtractor={(item) => item.diamond_id}
        renderItem={({ item, index }) => (
          <View style={styles.comic}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => comicsPressHandler(index)}
            >
              <ImageBackground
                style={styles.comicCover}
                source={{ uri: item.image }}
              >
                {pulledArr[index] ? (
                  <Image
                    style={styles.star}
                    source={require("../assets/dd.png")}
                  />
                ) : (
                  <></>
                )}
              </ImageBackground>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const hieght = Dimensions.get("window").height;
const styles = StyleSheet.create({
  comic: {
    alignItems: "center",
    backgroundColor: "rgb(0, 194, 128)",
    borderRadius: 10,
    marginHorizontal: "5%",
    paddingVertical: "2%",
    width: "45%",
    marginLeft: "1.5%",
    marginBottom: "5%",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
  },
  comicCover: {
    height: hieght * 0.3,
    aspectRatio: 9 / 14,
  },
  star: {
    height: hieght * 0.03,
    aspectRatio: 1.1,
    alignSelf: "flex-start",
  },
});

export default Comics;
