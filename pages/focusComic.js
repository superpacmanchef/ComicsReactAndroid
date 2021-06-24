import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, RefreshControl } from "react-native";
import {
  checkCollection,
  checkPullList,
  getPull,
} from "../apis/UserDatabaseApi";
import { ScrollView } from "react-native-gesture-handler";
import FocusForm from "../components/FocusComic/focusForm";
import { useAppSelector } from "../redux/hooks";
import { getPullListState } from "../redux/reducers/pullList";
import { getLogedState } from "../redux/reducers/logedIn";
import { getCollectionState } from "../redux/reducers/collection";
import Comics from "../components/Comics/comics";

const FocusComic = ({ route }) => {
  const { Comic, getPullHandler } = route.params;

  const loged = useAppSelector(getLogedState);
  const pull = useAppSelector(getPullListState);
  const collection = useAppSelector(getCollectionState);
  const [formType, updateFormType] = useState([]);

  //updates FormType Array [1/3 ,2/4]
  //odd for yes to comics is in collection / pull
  //even for no to comics is in collection / pull
  const checkComic = async (pull) => {
    if (loged) {
      // const collectionRes = await checkCollection(Comic);
      const pullRes = await checkPullList(Comic, pull);
      const collectionRes = await checkCollection(Comic, collection);
      updateFormType([collectionRes, pullRes]);
    } else {
      updateFormType([]);
    }
  };

  useEffect(() => {
    checkComic(pull);
  }, [Comic, pull, collection]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <>
        <Text>{Comic.publisher}</Text>
        <Text>
          Store Date: {Comic.release_date ? Comic.release_date : Comic.store_date}
        </Text>
        <Text>Diamond ID: {Comic.diamond_id}</Text>
        <Text>ComicVine ID: {Comic.id}</Text>
        <Text>{Comic.name}</Text>
        <Text>{Comic.description}</Text>
        <Text>{Comic.creators}</Text>
        <Text>{Comic.price}</Text>
        <Text>{Comic.publisher}</Text>

        {formType.length > 0 ? (
          <View style={styles.focusForm}>
            <FocusForm
              focusType={formType[0]}
              comic={Comic}
              checkComic={checkComic}
              getPullHandler={getPullHandler}
            />
            <FocusForm
              focusType={formType[1]}
              comic={Comic}
              checkComic={checkComic}
              getPullHandler={getPullHandler}
            />
          </View>
        ) : null}

        <Image style={styles.tinyLogo} source={{ uri: Comic.image }} />
      </>
    </ScrollView>
  );
};
export default FocusComic;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 300,
    height: 475,
  },
  container: {
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  load: {
    alignSelf: "center",
  },
  focusForm: {
    flexDirection: "row",
  },
});
