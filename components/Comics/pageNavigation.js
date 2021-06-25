import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PageNavigation = (props) => {
  const { updatePageNoHandler, pageNo, totalPages } = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={pageNo === 0 ? true : false}
        style={[styles.filterSubmit, pageNo === 0 ? styles.disabled : null]}
        onPress={() => {
          updatePageNoHandler(-1);
        }}>
        <Text style={styles.buttonText}>Page Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterSubmit,
          pageNo + 1 == totalPages ? styles.disabled : null,
        ]}
        disabled={pageNo === totalPages - 1 || totalPages == 0 ? true : false}
        onPress={() => {
          updatePageNoHandler(1);
        }}>
        <Text style={[styles.buttonText]}>Page Forword</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PageNavigation;

const styles = StyleSheet.create({
  filterSubmit: {
    backgroundColor: '#FFFF',
    height: 40,
    width: 150,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3F51B5',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    backgroundColor : 'rgba(0, 0, 0, 0)'
  },
  disabled: {
    backgroundColor: '#d8d8d8',
  },
});
