import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  insertCollection,
  removeCollection,
  insertPullList,
  removePullList,
  getPull,
} from "../apis/UserDatabaseApi";
import { getMarvelData, getComicData } from "../apis/ComicApi";
import {
  processMarvelData,
  processComicVineData,
} from "../utils/comicDataProcessesing";
import { comicTitleSplit } from "../utils/comicDataProcessesing";
import { PullContext } from "../contexts/pullContext";

const FocusForm = (props) => {
  const { focusType, comic, checkComic } = props;

  const [pull, updatePull] = useContext(PullContext);

  //SPLIT MARVEL AND COMICVINE API PARTS
  const processData = async () => {
    if (comic.publisher === "MARVEL COMICS") {
      const marvelData = await getMarvelData(comic.diamond_id, comic.title);
      if (marvelData) {
        return processMarvelData(marvelData);
      } else {
        return null;
      }
    } else {
      const comicData = await getComicData(comic.diamond_id, comic.title);
      if (comicData) {
        return processComicVineData(comicData);
      } else {
        return null;
      }
    }
  };

  const insertCollectionHandler = async () => {
    const res = await processData();
    if (!res.description) {
      res.description = comic.description;
    }
    if (!res.store_date) {
      res.store_date = comic.release_date;
    }
    res.creators = comic.creators;
    res.diamond_id = comic.diamond_id;
    res.publisher = comic.publisher;
    const colRes = await insertCollection(res);
    if (colRes === true) {
      alert("Added to Collection");
      checkComic();
    } else {
      alert("Error");
    }
  };
  const removeCollectionHandler = async () => {
    const res = await processData();
    const colRes = await removeCollection(res);
    if (colRes === true) {
      alert("done");
      checkComic();
    } else {
      alert("error");
    }
  };
  const insertPullListHandler = async () => {
    const [name] = comicTitleSplit(comic.title);
    const pullRes = await insertPullList(name);
    if (pullRes) {
      alert(pullRes + " added to Pull.");
      checkComic();
      getPull().then((res) => {
        updatePull(res);
      });
    } else {
      alert("Error");
    }
  };
  const removePullListHandler = async () => {
    const [name] = comicTitleSplit(comic.title);
    const pullRes = await removePullList(name);
    if (pullRes) {
      alert("Removed from PullList");
      checkComic();
      getPull().then((res) => {
        updatePull(res);
      });
    } else {
      alert("Error");
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
    borderColor: "rgb(0, 194, 128)",
  },
  buttonText: {
    fontSize: 15,
    textAlign: "center",
  },
});
