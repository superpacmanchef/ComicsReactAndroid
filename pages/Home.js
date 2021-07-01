import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Modal } from 'react-native'
import { getComics } from '../apis/ComicApi'
import Comics from '../components/Comics/comics'
import FilterComics from '../components/UIBits/filterComics'
import { FAB } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useAppSelector } from '../redux/hooks'
import { getLogedState } from '../redux/reducers/logedIn'
import { getPullListState } from '../redux/reducers/pullList'
import {
  filterComicVarients,
  filterComicPublisher,
  alphSort
} from '../utils/comicDataProcessesing'

const Home = ({ navigation }) => {
  const [allComics, updateAllComics] = useState([])
  const [filteredComics, updateFilteredComics] = useState(null)
  const [publishers, updatePublishers] = useState([
    'ALL',
    'MARVEL COMICS',
    'IMAGE COMICS',
    'DARK HORSE COMICS',
    'IDW COMICS'
  ])
  const [publisherState, updatePublisherState] = useState(publishers[0])
  const [weekState, updateWeekState] = useState(1)
  const [lastWeekState, updateLastWeekState] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const loged = useAppSelector(getLogedState)
  const pull = useAppSelector(getPullListState)

  useEffect(() => {
    filterChangeHandler()
  }, [])
  useEffect(() => {
    if (loged) {
      const pub = [
        'ALL',
        'MARVEL COMICS',
        'IMAGE COMICS',
        'DARK HORSE COMICS',
        'IDW COMICS',
        'PULL'
      ]
      updatePublishers(pub)
    } else {
      const pub = [
        'ALL',
        'MARVEL COMICS',
        'IMAGE COMICS',
        'DARK HORSE COMICS',
        'IDW COMICS'
      ]
      updatePublishers(pub)
    }
  }, [loged])

  //If week hasnt chnaged from last invokation
  //Get and update new filteredComics and update TotalPages accordingly
  //Else Get desired weeks comics, update weekState, filter out variants update all comics
  //filter , order and update filteredComics and update TotalPages accordingly
  const filterChangeHandler = async () => {
    //Just publsiher changes
    if (lastWeekState && lastWeekState === weekState) {
      const filteredComicPublisher = filterComicPublisher(
        allComics,
        publisherState,
        pull
      )
      updateFilteredComics(filteredComicPublisher)
    } else {
      // Week and/or publisher changed
      const weekComics = await getComics(weekState)
      updateLastWeekState(weekState)
      const varientFilteredComics = filterComicVarients(weekComics)
      updateAllComics(varientFilteredComics)
      const filteredComics = filterComicPublisher(
        varientFilteredComics,
        publisherState,
        pull
      )
      alphSort(filteredComics)
      updateFilteredComics(filteredComics)
    }
  }

  //Navigates to Focus Comic on press
  const comicsPressHandler = (comic) => {
    navigation.navigate('FoucsComic', {
      Comic: comic
    })
  }

  return (
    <>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false)
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
        icon={<Ionicons name={'ios-funnel'} size={30} />}
        style={{
          marginBottom: 65
        }}
        placement="right"
        color="red"
        onPress={() => {
          setModalVisible(true)
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginHorizontal: 10
  },
  heading: {
    fontSize: 20,
    alignSelf: 'center'
  },
  openButton: {
    backgroundColor: 'grey',
    width: 50
  }
})
export default Home
