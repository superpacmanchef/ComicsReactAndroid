import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  getCollectionAsync,
  getCollectionState
} from '../redux/reducers/collection'
import { FAB } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Comics from '../components/Comics/comics'
import { Input } from 'react-native-elements'
import { insertCollection } from '../apis/UserDatabaseApi'
import { getComicData } from '../apis/ComicApi'
import { processComicVineData } from '../utils/comicDataProcessesing'

const Collection = ({ navigation }) => {
  const [modalVisible, updateModalVisable] = useState(false)
  const [comicName, updateComicName] = useState('')
  const [issueNumber, updateIssueNumber] = useState('')
  const [comicTitle, updateComicTitle] = useState('')
  const [coverDate, updateCoverDate] = useState('')

  const collection = useAppSelector(getCollectionState)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (collection.length === 0) {
      dispatch(getCollectionAsync())
    }
  }, [collection.length, dispatch])

  //Navigates to Focus Comic on press
  const comicsPressHandler = (comic) => {
    navigation.navigate('FoucsComic', {
      Comic: comic
    })
  }

  const insertCollectionHandler = async (comic) => {
    const res = await insertCollection(comic)
    if (res !== true) {
      dispatch(getCollectionAsync)
    } else {
      alert('An error occured')
    }
  }

  const handleFormSubmit = async () => {
    if (comicName == '' || coverDate == '' || comicTitle == '') {
      alert('You missed a required input')
    } else {
      const comicData = await getComicData(
        '', // ComicVine ID -- unknown
        comicName,
        coverDate,
        comicTitle
      )
      const processedComicData = processComicVineData(comicData)
      insertCollectionHandler(processedComicData)
      updateComicName('')
      updateComicTitle('')
      updateIssueNumber('')
      updateCoverDate('')

      dispatch(getCollectionAsync())
    }
  }

  //Ensures correct date format - YYYY-MM-DD
  const handleDateUpdate = (date) => {
    if (
      date.length == 5 ||
      date.length == 8 ||
      coverDate.charAt(date.length) == '-'
    ) {
      date = date.substring(0, date.length - 1)
    } else if (date.length == 4 || date.length == 7) {
      date = date + '-'
    }
    updateCoverDate(date)
  }

  return (
    <>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            updateModalVisable(false)
          }}
        >
          <View style={styles.filters} id="filters">
            <Text style={styles.heading}>Add Comic To Collection</Text>

            <Input
              style={styles.textInput}
              placeholder="Comic Name - Required"
              value={comicName}
              onChange={(e) => {
                updateComicName(e.nativeEvent.text)
              }}
            />
            <Input
              style={styles.textInput}
              placeholder="Issue Number - Required"
              keyboardType="numeric"
              value={issueNumber}
              onChange={(e) => {
                updateIssueNumber(e.nativeEvent.text)
              }}
            />
            <Input
              style={styles.textInput}
              placeholder="Comic Title - Required"
              value={comicTitle}
              onChange={(e) => {
                updateComicTitle(e.nativeEvent.text)
              }}
              maxLength={10}
            />
            <Input
              style={styles.textInput}
              placeholder="Cover Date YYYY-DD-MM"
              value={coverDate}
              keyboardType="numeric"
              maxLength={10}
              onChange={(e) => {
                handleDateUpdate(e.nativeEvent.text)
              }}
            />

            <View>
              <TouchableOpacity
                style={styles.filterSubmit}
                title="Add"
                onPress={() => {
                  updateModalVisable(false)
                  handleFormSubmit()
                }}
              >
                <Text style={styles.buttonText}>Add Comic</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Comics comics={collection} comicsPressHandler={comicsPressHandler} />
      </View>
      <FAB
        icon={<Ionicons name={'ios-add'} size={25} />}
        placement="right"
        color="red"
        onPress={() => {
          updateModalVisable(true)
        }}
        style={styles.fab}
      />
    </>
  )
}

export default Collection
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginHorizontal: 10
  },
  filters: {
    marginVertical: 100,
    backgroundColor: '#3F51B5',

    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000'
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 5
  },
  filterSubmit: {
    backgroundColor: '#FFFF',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3F51B5',
    marginBottom: 10
  },
  buttonText: {
    fontSize: 20,
    paddingHorizontal: 5
  },
  heading: {
    alignSelf: 'center',
    fontSize: 25,
    paddingVertical: 20
  },
  fab: {
    marginBottom: 65
  }
})
