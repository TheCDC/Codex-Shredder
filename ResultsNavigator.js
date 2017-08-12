import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default class ResultsNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page,
      previousCallback: props.previousCallback,
      nextCallback: props.nextCallback
    };
  }
  render() {
    return (
      <View style={styles.cardSearchNavbar}>
        {this.state.page > 1
          ? <TouchableOpacity onPress={() => this.state.previousCallback()}>
              <Text style={[styles.pageNavButton, styles.navButtonText]}>
                {this.state.page - 1}
              </Text>
            </TouchableOpacity>
          : <Text
              style={[
                styles.pageNavButton,
                styles.pageNavButtonInactive,
                styles.navButtonText
              ]}
            />}
        <Text style={[styles.navButtonText]}>
          {this.state.page}
        </Text>
        <TouchableOpacity onPress={() => this.state.nextCallback()}>

          <Text style={[styles.pageNavButton, styles.navButtonText]}>

            {this.state.page + 1}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  cardSearchNavbar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  pageNavButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    color: "#000000",
    borderWidth: 1,
    borderColor: "#41d9f4",
    borderRadius: 7,
    textAlign: "center",
    backgroundColor: "#41d9f4",
    textAlignVertical: "center",
    margin: 5
  },
  navButtonText: {
    fontSize: 30
  },
  pageNavButtonInactive: {
    borderColor: "#F5FCFF",
    backgroundColor: "#F5FCFF"
  }
});