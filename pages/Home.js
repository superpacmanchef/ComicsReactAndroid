import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { getComics } from "../apis/ComicApi";
import Comics from "../components/Comics/comics";
import FilterComics from "../components/UIBits/filterComics";
import { FAB } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getLogedState } from "../redux/reducers/logedIn";
import {
  getPullListAsync,
  getPullListState,
  removeAllPull,
} from "../redux/reducers/pullList";
import {
  filterComicVarients,
  filterComicPublisher,
  alphSort,
  comicTitleSplit,
} from "../utils/comicDataProcessesing";
import {
  getCollectionAsync,
  removeAllCollection,
} from "../redux/reducers/collection";

const Home = ({ navigation }) => {
  const [publishers, updatePublishers] = useState([
    "ALL",
    "MARVEL COMICS",
    "IMAGE COMICS",
    "DARK HORSE COMICS",
    "IDW COMICS",
  ]);
  const [publisherState, updatePublisherState] = useState(publishers[0]);

  const [weekState, updateWeekState] = useState(1);
  const [lastWeekState, updateLastWeekState] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [allComics, updateAllComics] = useState([]);
  const [filteredComics, updateFilteredComics] = useState(null);

  const dispatch = useAppDispatch();
  const loged = useAppSelector(getLogedState);
  const pull = useAppSelector(getPullListState);

  useEffect(() => {
    if (loged) {
      dispatch(getPullListAsync());
      dispatch(getCollectionAsync());
      updatePublishers([
        "ALL",
        "MARVEL COMICS",
        "IMAGE COMICS",
        "DARK HORSE COMICS",
        "IDW COMICS",
        "PULL",
      ]);
    } else {
      dispatch(removeAllPull());
      dispatch(removeAllCollection());
    }
    weekChangeHandler();

    return () => {
      updatePublishers([
        "ALL",
        "MARVEL COMICS",
        "IDW PUBLISHING",
        "DARK HORSE COMICS",
      ]);
    };
  }, [loged]);

  const filterChangeHandler = async () => {
    //Just publsiher changes
    if (lastWeekState && lastWeekState === weekState) {
      publisherFilterHandler(allComics);
    } else {
      updateLastWeekState(weekState);
      weekChangeHandler();
    }
  };

  const weekChangeHandler = async () => {
    // Get weeks comics
    const weekComics = await getComics(weekState);

    // Filter varient covers
    const varientFilteredComics = filterComicVarients(weekComics);

    const splitFiltered = varientFilteredComics.map((comic) => {
      if (!comic.issue_number) {
        const [title, issue] = comicTitleSplit(comic.title);
        comic.title = title;
        comic.issue_number = issue === "" ? "" : "#" + issue;
      }
      return comic;
    });

    updateAllComics(splitFiltered);

    publisherFilterHandler(splitFiltered);
  };

  const publisherFilterHandler = (unfilteredcomics) => {
    //filter allComics by publisher
    const filteredComicPublisher = filterComicPublisher(
      unfilteredcomics,
      publisherState,
      pull
    );
    updateFilteredComics(filteredComicPublisher);
    alphSort(filteredComicPublisher);
  };

  //Navigates to Focus Comic on press
  const comicsPressHandler = (comic) => {
    navigation.navigate("FoucsComic", {
      Comic: comic,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <FilterComics
            publisherState={publisherState}
            updatePublisherState={updatePublisherState}
            publishers={publishers}
            weekState={weekState}
            updateWeekState={updateWeekState}
            setModalVisible={setModalVisible}
            filterChangeHandler={filterChangeHandler}
          />
        </Modal>
        <Comics
          comicsPressHandler={comicsPressHandler}
          comics={filteredComics}
        />
      </View>
      <FAB
        icon={<Ionicons name={"ios-funnel"} size={25} />}
        style={{
          marginBottom: 65,
        }}
        placement="right"
        color="red"
        onPress={() => {
          setModalVisible(true);
        }}
      />
    </>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    alignSelf: "center",
  },
  openButton: {
    backgroundColor: "grey",
    width: 50,
  },
});
