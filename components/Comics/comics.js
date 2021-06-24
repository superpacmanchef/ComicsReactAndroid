import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, View, Image, ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { comicTitleSplit } from "../../utils/comicDataProcessesing";
import { getLogedState } from "../../redux/reducers/logedIn";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import PageNavigation from "./pageNavigation";
import { getImages } from "../../apis/ComicApi";
import { getPullListState } from "../../redux/reducers/pullList";

const Comics = (props) => {
  const { comics, comicsPressHandler } = props;
  const [pulledArr, updatePulledArr] = useState([]);
  const [totalPages, updateTotalPages] = useState(0);
  const [pageNo, updatePageNo] = useState(0);
  const [comicsPage, updateComicsPage] = useState([]);

  const pull = useAppSelector(getPullListState);
  const loged = useAppSelector(getLogedState);

  //On comics change update total pages and reset currrent page to 0
  useEffect(() => {
    if (comics != null) {
      updateTotalPages(Math.ceil(comics.length / 10));
      updatePageNo(0);
      ComicsPageHandler(0);
    }
  }, [comics]);

  useEffect(() => {
    if (comics != null) {
      ComicsPageHandler(pageNo);
    }
  }, [pageNo]);

  useEffect(() => {
    if (loged) {
      updatePulledArr(checkPull(comicsPage));
    }
  }, [pull]);

  //Check if comics are on pull list
  //Returns T/F array
  const checkPull = (comics) => {
    const arr = [];
    if (loged && comics) {
      //Tests if pullList exists and is populated
      if (pull) {
        //Tests every comic.name in list against pullList
        //if true sets pulled to true
        comics.forEach((comic) => {
          for (let x = 0; x < pull.length; x++) {
            if (!comic.issue_number) {
              const [title, issue] = comicTitleSplit(comic.title);
              comic.title = title;
              comic.issue_number = issue === "" ? "" : "#" + issue;
            }
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

  //Sets comicPage to [] , Gets comicsPage and updates
  const ComicsPageHandler = async (pageNo) => {
    updateComicsPage([]);
    const comicsPage = await getComicsPage(pageNo);
    updateComicsPage(comicsPage);
  };

  // returns subset of comics based on page with fetched cover
  const getComicsPage = (pageNo) => {
    return new Promise((resolve, reject) => {
      if (comics != null) {
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
              resolve(comicArr);
            })
            .catch((err) => {
              // renders None found
              reject([]);
            });
        }
      }
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
    <>
    <View style={styles.screen}>
      <FlatList
        numColumns={2}
        data={comicsPage}
        keyExtractor={(item) => item.diamond_id}
        renderItem={({ item, index }) => (
          <View style={styles.comic}>
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
  footer : {
    flex: 0,
    flexDirection: "row",
    justifyContent: 'flex-end',
    backgroundColor : 'rgba(100, 100, 100, 08)'
  },
  screen: {
    height:" 100%"
  }
});

export default Comics;
