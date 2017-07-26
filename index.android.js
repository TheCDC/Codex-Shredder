/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Linking
} from "react-native";

const queryString = require("query-string");
class CardSearch extends Component {
  _getAllCards() {
    fetch(
      "http://card-codex-clone.herokuapp.com/static/card_commander_cardlist.txt"
    )
      .then(response => response.text())
      .then(text => {
        this.setState({ cardList: text.split("\n") });
      })
      .catch(error => {
        console.error(error);
      });
  }
  constructor(props) {
    super(props);
    this.state = { searchQuery: "lightning bolt", loaded: false };
    this._getAllCards();
  }
  query(name) {
    let params = { card: name };
    var qs = queryString.stringify(params);
    var targetUrl = "https://card-codex-clone.herokuapp.com/api/?" + qs;

    fetch(targetUrl)
      .then(response => response.json())
      .then(text => {
        if (text !== undefined && text !== null) {
          this.setState({ response: text, url: targetUrl, loaded: true });
        } else {
          this.setState({ loaded: false, response: null });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  getQuery() {
    return this.state.searchQuery;
  }
  render() {
    return (
      <View style={{ flex: 1 }}>

        <TextInput
          onChangeText={text => this.query(text)}
          placeholder="Search for a card"
        />
        {this.state.loaded
          ? <SearchResults response={this.state.response} />
          : <Text />}
      </View>
    );
  }
}

class SearchResults extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // this.state  = {responseText: "loading"};
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
      <ScrollView>
        <Text>
          Tap a card to search on Scryfall.
        </Text>
        <View>
          {this.props.response.similar_cards.map((card, index) => (
            <View key={index} style={styles.cardCard}>
              <Text
                onPress={() =>
                  Linking.openURL(
                    "http://scryfall.com/search?" +
                      queryString.stringify({ q: card.name })
                  )}
              >
                <Text style={[styles.cardText]}>
                  {card.name} | {card.type} | {card.manaCost} {"\n"}
                </Text>
                <Text style={[styles.cardTextBody, styles.cardText]}>
                  {card.text}
                  {card.power
                    ? <Text>|{card.power}/{card.toughness}</Text>
                    : ""}

                </Text>
              </Text>
            </View>
          ))}

        </View>

      </ScrollView>
    );
  }
}

export default class CardCodex extends Component {
  render() {
    return <CardSearch />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    flex: 1,
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  cardCard: {
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#000000",
    margin: 3,
    backgroundColor: "#FFFFFF",
    padding: 1
  },
  cardText: {
    color: "#000000"
  },
  cardTextBody: {
    margin: 1,
    padding: 1
  }
});

AppRegistry.registerComponent("CardCodex", () => CardCodex);
