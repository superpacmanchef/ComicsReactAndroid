import React from "react";
import { Picker, StyleSheet } from "react-native";

const DropDown = (props) => {
  const { options, state, labels, updateState } = props;
  return (
    <Picker
      style={[styles.dropDown, { backgroundColor: "white" }]}
      mode="dropdown"
      onValueChange={(itemValue) => updateState(itemValue)}
      selectedValue={state}
      key={labels[0]}
    >
      {options.map((option, index) => {
        return (
          <Picker.Item
            key={labels[index]}
            label={labels[index]}
            value={option}
          />
        );
      })}
    </Picker>
  );
};

export default DropDown;
const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#fff",
    borderWidth: 1,
  },
});
