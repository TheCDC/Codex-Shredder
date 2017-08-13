import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

const COLORS = ["W", "U", "B", "R", "G"];

export default class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callback: props.callback,
      colors: [true, true, true, true, true]
    };
  }
  render() {
    return (
      <View style={styles.colorPickerContainer}>
        {COLORS.map((item, index) => (
          <Text
            onPress={() => {
              let newcolors = this.state.colors;
              newcolors[index] = !newcolors[index];
              this.forceUpdate();
              this.state.callback(newcolors);
              this.setState({ colors: newcolors });
            }}
            key={index}
            style={
              this.state.colors[index]
                ? [styles.colorPickerButton, styles.colorPickerButtonActive]
                : [styles.colorPickerButton, styles.colorPickerButtonInactive]
            }
          >
            {item}
          </Text>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  colorPickerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  colorPickerButton: {
    width: 35,
    backgroundColor: "#AAAAAA",
    borderRadius: 3,
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 5
  },
  colorPickerButtonActive: {
    backgroundColor: "#AAFFAA"
  },
  colorPickerButtonInactive: {
    backgroundColor: "#FFAAAA"
  }
});
