import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { getCollection } from '../apis/UserDatabaseApi';
import Comics from '../components/comics';
import PageNavigation from '../components/pageNavigation';

const Collection = ({ navigation }) => {
  const [collectionState, updateCollection] = useState(null);
  const [pageNo, updatePageNo] = useState(0);
  const [comicsPage, updateComicsPage] = useState([]);
  const [totalPages, updateTotalPages] = useState();

  useEffect(() => {
    getCollectionHandler();
  }, []);
  useEffect(() => {
    getComicsPageHandler().then((res) => {
      updateComicsPage(res);
    });
  }, [collectionState, pageNo]);

  const getCollectionHandler = async () => {
    const collection = await getCollection();
    updateCollection(collection);
    updateTotalPages(Math.ceil(collection.length / 10));
    console.log(collection);
  };
  const comicsPressHandler = (index) => {
    navigation.navigate('FoucsComic', {
      Comic: comicsPage[index],
    });
  };
  const getComicsPageHandler = () => {
    return new Promise((resolve, reject) => {
      const comics = collectionState;
      if (comics) {
        let noPerPage = 10;
        let left = comics.length - 10 * pageNo;
        if (left < 10) {
          noPerPage = left;
        }

        let comicsPage = [];
        if (comics.length) {
          for (let x = 0; x < noPerPage; x++) {
            comicsPage.push(comics[pageNo * 10 + x]);
          }
        }
        resolve(comicsPage);
      }
    });
  };
  const updatePageNoHandler = (pos) => {
    if (pageNo < 0 && pos > 0) {
    } else if (pageNo + parseInt(pos) >= totalPages) {
    } else {
      updatePageNo(pageNo + parseInt(pos));
    }
  };

  return (
    <View style={styles.container}>
      <Comics comics={comicsPage} comicsPressHandler={comicsPressHandler} />
      <PageNavigation
        updatePageNoHandler={updatePageNoHandler}
        pageNo={pageNo}
        totalPages={totalPages}
      />
    </View>
  );
};
export default Collection;

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
    marginHorizontal: 10,
  },
});
