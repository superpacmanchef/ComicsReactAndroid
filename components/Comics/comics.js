import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, View, Image, ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { comicTitleSplit } from "../../utils/comicDataProcessesing";
import { getLogedState } from "../../redux/reducers/logedIn";
import { useAppSelector } from "../../redux/hooks";
import PageNavigation from "./pageNavigation";
import { getImages } from "../../apis/ComicApi";
import { getPullListState } from "../../redux/reducers/pullList";
import { Text } from "react-native";
import { ActivityIndicator } from "react-native";
const { height } = Dimensions.get("window");

const Comics = (props) => {
  const { comics, comicsPressHandler } = props;
  const [pulledArr, updatePulledArr] = useState([]);
  const [totalPages, updateTotalPages] = useState(0);
  const [pageNo, updatePageNo] = useState(0);
  const [comicsPage, updateComicsPage] = useState([]);
  const [load, updateLoad] = useState(true);

  const pull = useAppSelector(getPullListState);
  const loged = useAppSelector(getLogedState);

  //Dynamic font size based on hieght of device
  const fontSize = (10 * height) / 500;

  //On comics change update total pages and reset currrent page to 0
  //Then updates ComicsPage
  useEffect(() => {
    if (comics != null) {
      updateTotalPages(Math.ceil(comics.length / 10));
      updatePageNo(0);
      ComicsPageHandler(0);
    }
  }, [comics]);

  //On page change update updates ComicsPage
  useEffect(() => {
    if (comics != null) {
      ComicsPageHandler(pageNo);
    }
  }, [pageNo]);

  //On pull or comics change update pullArr
  useEffect(() => {
    if (loged) {
      updatePulledArr(checkPull(comicsPage));
    }
  }, [pull, comics]);

  //Check if comicsPage comics are on pull list
  //Returns bool array
  const checkPull = (comics) => {
    const arr = [];
    if (loged && comics) {
      //Tests if pullList exists and is populated
      if (pull) {
        //Tests every comic.name in list against pullList
        //if true sets pulled to true
        comics.forEach((comic) => {
          for (let x = 0; x < pull.length; x++) {
            const title = comic.title
              .replace(/AND/g, "")
              .replace(/THE/g, "")
              .toUpperCase();
            const strippedPull = pull[x].toUpperCase();
            if (strippedPull === title) {
              arr.push(true);
              break;
            }
            if (x == pull.length - 1) {
              arr.push(false);
            }
          }
        });
      }
    }
    return arr;
  };

  // returns subset of comics based on page with fetched cover
  const getComicsPage = (pageNo) => {
    return new Promise((resolve, reject) => {
      if (comics != null && comics.length != 0) {
        // Calc the correct number of comics of page
        // eg. only show 5 if there is only 5 left in array
        let noPerPage = 10;
        let left = comics.length - 10 * pageNo;
        if (left < 10) {
          noPerPage = left;
        }

        //splices the correct sub array of comics for the page
        let comicsPage = comics.slice(pageNo * 10, pageNo * 10 + noPerPage);

        if (!comicsPage.length) {
          updateLoad(false);
          resolve([]);
        } else {
          // retrieve covers for all comics in page
          Promise.all(
            comicsPage.map((comic) => {
              if (comic.image) {
                return comic;
              } else {
                return getImages(comic).then((res) => {
                  comic.image = res;
                  return comic;
                });
              }
            })
          )
            .then((comicArr) => {
              updatePulledArr(checkPull(comicArr));
              updateLoad(false);
              resolve(comicArr);
            })
            .catch((err) => {
              // renders None found
              updateLoad(false);
              reject([]);
            });
        }
      } else {
        updateLoad(false);
        resolve([]);
      }
    });
  };

  const ComicsPageHandler = async (pageNo) => {
    updateComicsPage([]);
    updateLoad(true);
    const comicsPage = await getComicsPage(pageNo);
    updateComicsPage(comicsPage);
  };

  const updatePageNoHandler = (pos) => {
    if (pageNo < 0 && pos > 0) {
    } else if (pageNo + parseInt(pos) >= totalPages) {
    } else {
      updatePageNo(pageNo + parseInt(pos));
    }
  };

  //Loading Indicator
  if (load) {
    return (
      <>
        <View style={styles.altScreen}>
          <ActivityIndicator
            size={"large"}
            color="#0000ff"
            style={{ marginVertical: "50%", flex: 1 }}
          />
          <PageNavigation
            updatePageNoHandler={updatePageNoHandler}
            pageNo={pageNo}
            totalPages={totalPages}
            style={styles.footer}
          />
        </View>
      </>
    );
  } else if (comicsPage.length == 0 || comics == null) {
    return (
      <>
        <View style={styles.altScreen}>
          <Text style={{ fontSize: 30, flex: 1, marginVertical: "50%" }}>
            None Found
          </Text>
          <PageNavigation
            updatePageNoHandler={updatePageNoHandler}
            pageNo={pageNo}
            totalPages={totalPages}
            style={styles.footer}
          />
        </View>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.screen}>
          <FlatList
            numColumns={2}
            data={comicsPage}
            keyExtractor={(item) => item.diamond_id}
            renderItem={({ item, index }) => (
              <View style={styles.comic}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: fontSize,
                    marginHorizontal: "5%",
                  }}
                >
                  {item.title} {item.issue_number}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => comicsPressHandler(item)}
                >
                  <ImageBackground
                    style={styles.comicCover}
                    source={{ uri: item.image }}
                  >
                    {pulledArr[index] ? (
                      <Image
                        style={styles.star}
                        source={require("../../assets/dd.png")}
                      />
                    ) : (
                      <></>
                    )}
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            )}
          />
          <PageNavigation
            updatePageNoHandler={updatePageNoHandler}
            pageNo={pageNo}
            totalPages={totalPages}
            style={styles.footer}
          />
        </View>
      </>
    );
  }
};

const hieght = Dimensions.get("window").height;
const styles = StyleSheet.create({
  comic: {
    alignItems: "center",
    backgroundColor: "#3F51B5",
    borderRadius: 10,
    paddingVertical: 5,
    marginBottom: "5%",
    paddingBottom: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
    flex: 1,
    marginHorizontal: 6,
    paddingHorizontal: 3,
  },
  comicCover: {
    height: hieght * 0.3,
    aspectRatio: 9 / 14,
    alignSelf: "flex-end",
  },
  star: {
    height: hieght * 0.04,
    aspectRatio: 1.1,
    alignSelf: "flex-end",
  },
  footer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "rgba(100, 100, 100, 08)",
    position: "absolute",
    alignSelf: "flex-end",
  },
  screen: {
    flex: 0,
    height: "100%",
  },
  altScreen: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Comics;
