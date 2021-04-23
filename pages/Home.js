import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { getComics, getImages } from "../apis/ComicApi";
import Comics from "../components/comics";
import FilterComics from "../components/filterComics";
import FAB from "react-native-fab";
import PageNavigation from "../components/pageNavigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import LogedContext from "../contexts/logedContext";
import { PullContext } from "../contexts/pullContext";
import { comicTitleSplit } from "../utils/comicDataProcessesing";

const Home = ({ navigation }) => {
  const [totalPages, updateTotalPages] = useState(0);
  const [allComics, updateAllComics] = useState([]);
  const [filteredComics, updateFilteredComics] = useState([]);
  const [publishers, updatePublishers] = useState([
    "ALL",
    "MARVEL COMICS",
    "DC",
    "IMAGE COMICS",
  ]);
  const [publisherState, updatePublisherState] = useState(publishers[0]);
  const [weekState, updateWeekState] = useState(1);
  const [lastWeekState, updateLastWeekState] = useState(null);
  const [comicsPage, updateComicsPage] = useState();
  const [pageNo, updatePageNo] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loged, updateLoged] = useContext(LogedContext);
  const [pull, updatePull] = useContext(PullContext);

  useEffect(() => {
    filterChangeHandler();
  }, []);

  useEffect(() => {
    ComicsPageHandler();
  }, [filteredComics, pageNo]);

  useEffect(() => {
    if (loged) {
      const pub = ["ALL", "MARVEL COMICS", "DC", "IMAGE COMICS", "PULL"];
      updatePublishers(pub);
    } else {
      const pub = ["ALL", "MARVEL COMICS", "DC", "IMAGE COMICS"];
      updatePublishers(pub);
    }
  }, [loged]);

  //If week hasnt chnaged from last invokation
  //Get and update new filteredComics and update TotalPages accordingly
  //Else Get desired weeks comics, update weekState, filter out variants update all comics
  //filter , order and update filteredComics and update TotalPages accordingly
  const filterChangeHandler = async () => {
    updatePageNo(0);
    if (lastWeekState && lastWeekState === weekState) {
      const filteredComicPublisher = filterComicPublisher(allComics);
      updateTotalPages(Math.ceil(filteredComicPublisher.length / 10));
      updateFilteredComics(filteredComicPublisher);
    } else {
      const weekComics = await getComics(weekState);
      updateLastWeekState(weekState);
      const varientFilteredComics = filterComicVarients(weekComics);
      updateAllComics(varientFilteredComics);
      const filteredComics = filterComicPublisher(varientFilteredComics);
      updateTotalPages(Math.ceil(filteredComics.length / 10));
      alphSort(filteredComics);
      updateFilteredComics(filteredComics);
    }
  };

  //Filters array of comics and returen array of only publisher in publisherState
  const filterComicPublisher = (comics) => {
    if (publisherState === "ALL") {
      return comics;
    } else if (publisherState === "PULL") {
      let f = [];
      comics.map((comic) => {
        for (let x = 0; x < pull.length; x++) {
          const comicTitle = comic.title
            .replace(/THE /g, "")
            .replace(/AND /g, "");

          let strippedPull = pull[x]
            .toUpperCase()
            .replace(/[.,#!$%&;:{}=`~()]/g, "")
            .replace(/AND /g, "")
            .replace(/THE /g, "");

          const [name] = comicTitleSplit(comicTitle);
          if (strippedPull === name) {
            f.push(comic);
          }
        }
        return null;
      });
      return f;
    } else {
      let f = comics.filter(function (n) {
        return n.publisher === publisherState;
      });
      return f;
    }
  };
  //Filter out variant comics from inpyut array of comics
  const filterComicVarients = (comics) => {
    let filteredComics = [];
    comics.map((comic) => {
      if (
        comic.title.includes(" VAR") ||
        comic.title.includes(" CVR") ||
        comic.title.includes(" TP") ||
        comic.title.includes(" VOL") ||
        comic.title.includes(" OMNIBUS") ||
        comic.title.includes("COPY") ||
        comic.title.includes(" HC") ||
        comic.title.includes(" LTD ED") ||
        comic.title.includes(" COVER") ||
        comic.title.includes(" GN") ||
        comic.title.includes(" CV") ||
        comic.title.includes(" VA") ||
        comic.title.includes(" PTG")
      ) {
      } else {
        filteredComics.push(comic);
      }
      return null;
    });
    return filteredComics;
  };
  //Alphabetcally sort array of comics.`
  const alphSort = (comics) => {
    if (comics) {
      comics.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        }
        if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    }
  };

  //Sets comicPage to Null , Gets comicsPage and updates
  const ComicsPageHandler = async () => {
    updateComicsPage();
    const comicsPage = await getComicsPage();
    updateComicsPage(comicsPage);
  };

  //Returns number comics from collectionState, Gets Image from API and returns
  //collectionState[pageNo * 10] to collectionState [pageNo * 10] + 9.
  //10 items per page
  const getComicsPage = () => {
    return new Promise((resolve, reject) => {
      const comics = filteredComics;
      let noPerPage = 10;
      let left = comics.length - 10 * pageNo;
      if (left < 10) {
        noPerPage = left;
      }

      let comicsPage = [];
      if (comics.length > 0) {
        for (let x = 0; x < noPerPage; x++) {
          let comic = comics[pageNo * 10 + x];
          getImages(comic)
            .then((res) => {
              if (res) {
                comic.image = res;
                comicsPage.push(comic);
              } else {
                reject();
              }
            })
            .then(() => {
              if (comicsPage.length === noPerPage) {
                alphSort(comicsPage);
                resolve(comicsPage);
              }
            });
        }
      } else {
        resolve([]);
      }
    });
  };

  //Navigates to Focus Comic on press
  const comicsPressHandler = (index) => {
    navigation.navigate("FoucsComic", {
      Comic: comicsPage[index],
    });
  };

  //Ensures Page Number is possible i.e -1
  const updatePageNoHandler = (pos) => {
    if (pageNo < 0 && pos > 0) {
    } else if (pageNo + parseInt(pos) >= totalPages) {
    } else {
      updatePageNo(pageNo + parseInt(pos));
    }
  };

  return (
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
      <Comics comicsPressHandler={comicsPressHandler} comics={comicsPage} />
      <FAB
        iconTextComponent={<Ionicons name={"ios-funnel"} />}
        onClickAction={() => {
          setModalVisible(true);
        }}
      />
      <PageNavigation
        updatePageNoHandler={updatePageNoHandler}
        pageNo={pageNo}
        totalPages={totalPages}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
    marginHorizontal: 10,
    alignItems: "center",
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
export default Home;
