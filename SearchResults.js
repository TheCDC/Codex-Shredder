import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import CardCard from "./CardCard";

export default class SearchResults extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // this.state  = {responseText: "loading"};
    const target_card = this.props.response.target_card;
    if (
      this.props.response.similar_cards == null ||
      this.props.response.similar_cards === undefined
    ) {
      return (
        <View>
          <Text>
            No similar cards.
          </Text>
        </View>
      );
    }
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          Your search
        </Text>
        <View style={[styles.searchedCard]}>
          <CardCard card={target_card} />

        </View>

        <Text style={{ textAlign: "center" }}>
          Tap a card to view on Scryfall. Long tap to copy/paste.
        </Text>
        <View>
          {this.props.response.similar_cards.map((cardObj, index) => (
            <CardCard card={cardObj} key={index} />
          ))}

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchedCard: {
    backgroundColor: "wheat"
  }
});
