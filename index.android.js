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
  Linking,
  Keyboard
} from "react-native";

function scryfallLink(cardName) {
  return "http://scryfall.com/search?" + queryString.stringify({ q: cardName });
}

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
    this.state = {
      searchQuery: "",
      loaded: false,
      matchingCards: [],
      cardList: []
    };
    this._getAllCards();
  }
  query(targetName) {
    let params = { card: targetName };
    let qs = queryString.stringify(params);
    let targetUrl = "https://card-codex-clone.herokuapp.com/api/?" + qs;
    // filter card names containing the query
    let foundMatches = this.state.cardList.filter(function(cardName) {
      const a = cardName.toLowerCase();
      const b = targetName.toLowerCase();
      return a.indexOf(b) !== -1;
      // console.error(a + "|" + b);
    });
    this.setState({ matchingCards: foundMatches });

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
        <ScrollView keyboardShouldPersistTaps={"always"}>
          <TextInput
            onChangeText={text => this.query(text)}
            placeholder="Search for a card"
            onSubmitEditing={Keyboard.dismiss}
          />

          <View>
            <Text>
              Matches
            </Text>
            {this.state.matchingCards.slice(0, 10).map((cardName, index) => (
              <Text
                key={index}
                onPress={() => {
                  this.query(cardName);
                  Keyboard.dismiss();
                }}
                style={styles.cardCompleteSuggestion}
              >
                {cardName}
              </Text>
            ))}

          </View>

          {this.state.loaded
            ? <SearchResults response={this.state.response} />
            : <Text />}
        </ScrollView>
      </View>
    );
  }
}

class CardCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const card = this.props.card;
    return (
      <View style={styles.cardCard}>
        <Text onPress={() => Linking.openURL(scryfallLink(card.name))}>
          <Text style={[styles.cardText]}>
            {card.name} | {card.manaCost}
            {"\n"}
            {card.type} | {card.set.code} ({card.set.name})
            {"\n"}
          </Text>
          <Text style={[styles.cardTextBody, styles.cardText]}>
            {card.text}
            {card.power ? <Text>|{card.power}/{card.toughness}</Text> : ""}

          </Text>
        </Text>
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
        <Text>
          Your search
        </Text>
        <View style={[styles.searchedCard]}>
          <CardCard card={target_card} />

        </View>

        <Text>
          Tap a card to view on Scryfall.
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

export default class CodexShredder extends Component {
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
    padding: 1
  },
  cardText: {
    color: "#000000"
  },
  cardTextBody: {
    margin: 1,
    padding: 1
  },
  cardCompleteSuggestion: {
    backgroundColor: "#AAAAFF",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#AAAAFF",
    color: "#000000",
    margin: 1,
    padding: 3
  },
  searchedCard: {
    backgroundColor: "wheat"
  }
});

AppRegistry.registerComponent("CodexShredder", () => CodexShredder);
