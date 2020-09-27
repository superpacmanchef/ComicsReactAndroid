import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, RefreshControl } from 'react-native';
import { checkCollection, checkPullList } from '../apis/UserDatabaseApi';
import LogedContext from '../contexts/logedContext';
import { ScrollView } from 'react-native-gesture-handler';
import FocusForm from '../components/focusForm';

const FocusComic = ({ route }) => {
  const { Comic, getPullHandler } = route.params;

  const [loged, updateLoged] = useContext(LogedContext);
  const [formType, updateFormType] = useState([]);

  const checkComic = async () => {
    if (loged) {
      const collectionRes = await checkCollection(Comic);
      const pullRes = await checkPullList(Comic);
      updateFormType([collectionRes, pullRes]);
    } else {
      updateFormType([]);
    }
  };

  useEffect(() => {
    checkComic();
  }, [Comic]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <>
        <Text>{Comic.publisher}</Text>
        <Text>
          {Comic.release_date ? Comic.release_date : Comic.store_date}
        </Text>
        <Text>{Comic.name}</Text>
        <Text>{Comic.description}</Text>
        <Text>{Comic.creators}</Text>

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  load: {
    alignSelf: 'center',
  },
  focusForm: {
    flexDirection: 'row',
  },
});
