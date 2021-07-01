import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { checkCollection, checkPullList } from '../apis/UserDatabaseApi'
import { ScrollView } from 'react-native-gesture-handler'
import FocusForm from '../components/FocusComic/focusForm'
import { useAppSelector } from '../redux/hooks'
import { getPullListState } from '../redux/reducers/pullList'
import { getLogedState } from '../redux/reducers/logedIn'
import { getCollectionState } from '../redux/reducers/collection'
import HTML from 'react-native-render-html'

const FocusComic = ({ route }) => {
  const { Comic, getPullHandler } = route.params

  console.log(Comic)

  const loged = useAppSelector(getLogedState)
  const pull = useAppSelector(getPullListState)
  const collection = useAppSelector(getCollectionState)
  const [formType, updateFormType] = useState([])

  //updates FormType Array [1/3 ,2/4]
  //odd for yes to comics is in collection / pull
  //even for no to comics is in collection / pull
  const checkComic = async (pull) => {
    if (loged) {
      // const collectionRes = await checkCollection(Comic);
      const pullRes = await checkPullList(Comic, pull)
      const collectionRes = await checkCollection(Comic, collection)
      updateFormType([collectionRes, pullRes])
    } else {
      updateFormType([])
    }
  }

  useEffect(() => {
    checkComic(pull)
  }, [Comic, pull, collection])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <>
        <Text style={styles.title}>{Comic.publisher}</Text>
        <Text>
          Store Date:
          {Comic.release_date ? Comic.release_date : Comic.store_date}
        </Text>
        {Comic.diamond_id ? <Text>Diamond ID: {Comic.diamond_id}</Text> : null}
        {Comic.id ? <Text>ComicVine ID: {Comic.id}</Text> : null}
        {Comic.name ? <Text>{Comic.name}</Text> : null}
        <Text style={styles.title}>Description</Text>
        <HTML source={{ html: Comic.description }} />
        {Comic.creators ? <Text>{Comic.creators}</Text> : null}
        {Comic.price ? <Text>Price : {Comic.price}</Text> : null}

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
  )
}

export default FocusComic
const styles = StyleSheet.create({
  tinyLogo: {
    width: 300,
    height: 475
  },
  container: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  load: {
    alignSelf: 'center'
  },
  focusForm: {
    flexDirection: 'row'
  },
  title: {
    fontSize: 18
  }
})
