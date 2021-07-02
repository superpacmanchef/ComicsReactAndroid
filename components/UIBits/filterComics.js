import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import DropDown from './dropDown'

const FilterComics = (props) => {
  const {
    publisherState,
    updatePublisherState,
    publishers,
    weekState,
    updateWeekState,
    setModalVisible,
    filterChangeHandler
  } = props
  return (
    <View style={styles.filters} id="filters">
      <Text style={styles.heading}>Publisher</Text>
      <DropDown
        options={publishers}
        state={publisherState}
        labels={publishers}
        updateState={updatePublisherState}
      />

      <Text style={styles.heading}>Weeks</Text>
      <DropDown
        options={[0, 1]}
        state={weekState}
        labels={['Last Week Comics', 'This Week Comics']}
        updateState={updateWeekState}
      />
      <View>
        <TouchableOpacity
          style={styles.filterSubmit}
          title="Filter"
          onPress={() => {
            filterChangeHandler()
            setModalVisible(false)
          }}
        >
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default FilterComics
const styles = StyleSheet.create({
  filters: {
    marginHorizontal: 60,
    marginVertical: 200,
    backgroundColor: '#3F51B5',

    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000'
  },
  heading: {
    alignSelf: 'center',
    fontSize: 30
  },
  filterSubmit: {
    backgroundColor: '#FFFF',
    width: 100,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3F51B5'
  },
  buttonText: {
    fontSize: 20
  }
})
