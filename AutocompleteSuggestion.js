import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const COLORCOLORS = {
  W: "#FFF9D6",
  U: "#5EBEFF",
  B: "#000000",
  R: "#FF0000",
  G: "#1FAA00"
};

export default class AutocompleteSuggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callback: props.callback,
      cardName: props.cardName
    };
  }

  render() {
    const card = this.props.card;
    return (
      <TouchableOpacity onPress={() => this.state.callback()}>
        <Text style={styles.cardCompleteSuggestion}>
          {this.state.cardName}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardCompleteSuggestion: {
    backgroundColor: "#AAAAFF",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#AAAAFF",
    color: "#000000",
    margin: 1,
    fontSize: 17,
    paddingHorizontal: 3
  }
});
