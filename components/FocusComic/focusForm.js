import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  insertCollection,
  removeCollection,
  insertPullList,
  removePullList,
} from "../../apis/UserDatabaseApi";
import { comicTitleSplit } from "../../utils/comicDataProcessesing";
import { useAppDispatch } from "../../redux/hooks";
import { getPullListAsync } from "../../redux/reducers/pullList";
import { getCollectionAsync } from "../../redux/reducers/collection";

const FocusForm = (props) => {
  const { focusType, comic } = props;

  const dispatch = useAppDispatch();

  const insertCollectionHandler = async () => {
    const colRes = await insertCollection(comic);
    if (colRes === true) {
      alert(comic.title + " Added to Collection");
      dispatch(getCollectionAsync());
    } else {
      alert("An error occured");
    }
  };
  const removeCollectionHandler = async () => {
    const colRes = await removeCollection(comic);
    if (colRes === true) {
      alert(comic.title + " Removed from Collection");
      dispatch(getCollectionAsync());
    } else {
      alert("An error occured");
    }
  };

  const insertPullListHandler = async () => {
    const pullRes = await insertPullList(
      comic.title.replace(/THE /g, "").replace(/The /g, "").toUpperCase()
    );
    if (pullRes) {
      alert(pullRes + " Added to Pull List");
      dispatch(getPullListAsync());
    } else {
      alert("An error occured");
    }
  };
  const removePullListHandler = async () => {
    const pullRes = await removePullList(
      comic.title.replace(/THE /g, "").replace(/The /g, "").toUpperCase()
    );
    if (pullRes) {
      alert(pullRes + " Removed from Pull List");
      dispatch(getPullListAsync());
    } else {
      alert("An error occured");
    }
  };

  if (focusType == 1) {
    return (
      //INSERT COLLECTION BUTTON
      <TouchableOpacity
        style={styles.submit}
        onPress={() => {
          insertCollectionHandler();
        }}
      >
        <Text style={styles.buttonText}>Insert into Collection</Text>
      </TouchableOpacity>
    );
  } else if (focusType == 3) {
    //REMOVE COLLECTION BUTTON
    return (
      <TouchableOpacity
        style={styles.submit}
        onPress={() => {
          removeCollectionHandler();
        }}
      >
        <Text style={styles.buttonText}>Remove from Collection</Text>
      </TouchableOpacity>
    );
  } else if (focusType == 2) {
    //INSERT PULL LIST BUTTON
    return (
      <TouchableOpacity
        style={styles.submit}
        onPress={() => {
          insertPullListHandler();
        }}
      >
        <Text style={styles.buttonText}>Insert into Pull List</Text>
      </TouchableOpacity>
    );
  } else if (focusType == 4) {
    //REMOVE PULL LIST BUTTON
    return (
      <TouchableOpacity
        style={styles.submit}
        onPress={() => {
          removePullListHandler();
        }}
      >
        <Text style={styles.buttonText}>Remove from Pull List</Text>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

export default FocusForm;

const styles = StyleSheet.create({
  submit: {
    backgroundColor: "#FFFF",
    width: 100,
    alignSelf: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3F51B5",
  },
  buttonText: {
    fontSize: 15,
    textAlign: "center",
  },
});
