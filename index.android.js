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
  Keyboard,
  Alert,
  Clipboard,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity
} from "react-native";

import ColorPicker from "./ColorPicker";
import AutocompleteSuggestion from "./AutocompleteSuggestion";
import ResultsNavigator from "./ResultsNavigator";
import SearchResults from "./SearchResults";

var cardsObj = require("./res/cards.json");

const queryString = require("query-string");

const COLORS = ["W", "U", "B", "R", "G"];
const COLORCOLORS = {
  W: "#FFF9D6",
  U: "#5EBEFF",
  B: "#000000",
  R: "#FF0000",
  G: "#1FAA00"
};
class Banner extends Component {
  render() {
    return (
      <View>
        <Text style={styles.welcome}>
          Codex Shredder
        </Text>
      </View>
    );
  }
}

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
  _clearQuery() {
    if (this._textinput !== null) {
      this._textinput.setNativeProps({ text: "" });
      this.query("", 0);
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchQuery: "",
      searchIsLoaded: true,
      matchingCards: [],
      cardList: cardsObj.cards,
      page: 1,
      response: null,
      colors: []
    };
    this._getAllCards();
    BackHandler.addEventListener(
      "BackHandler",
      function() {
        this._clearQuery();
        return true;
      }.bind(this)
    );
  }
  query(targetName, requestedPage) {
    this.setState({ searchIsLoaded: false });
    const targetPage = requestedPage + 1;
    this.setState({ page: targetPage });
    // filter card names containing the query
    var foundMatches = this.state.cardList.filter(function(cardName) {
      const a = cardName.toLowerCase();
      const b = targetName.toLowerCase();
      return a.indexOf(b) !== -1;
      // console.error(a + "|" + b);
    });

    // sort auto complete results
    foundMatches.sort(function(card1, card2) {
      let c1 = card1.toLowerCase();
      let c2 = card2.toLowerCase();

      const a = targetName.toLowerCase();
      // give lower values to cards where the target is closer to their length
      return a.length / c2.length - a.length / c1.length;
    });
    this.setState({ matchingCards: foundMatches });

    let finalName = targetName;

    this.setState({ searchQuery: finalName });

    // build the url
    let params = { card: finalName, page: targetPage };
    let qs = queryString.stringify(params);
    let targetUrl = "https://card-codex-clone.herokuapp.com/api/?" + qs;
    // hack to get color filtering
    this.state.colors.map(
      (item, index) => (targetUrl += item ? "&ci=" + COLORS[index] : "")
    );

    fetch(targetUrl)
      .then(response => response.json())
      .then(text => {
        if (text !== undefined && text !== null) {
          this.setState({
            response: text,
            url: targetUrl,
            searchIsLoaded: true
          });
        } else {
          this.setState({ searchIsLoaded: false, response: null });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  render() {
    let matchingCards = this.state.matchingCards.slice(0, 10);
    if (this.state.cardList.length === 0) {
      return (
        <View>
          <Banner />
          <Text> Fetching card names...</Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps={"always"}>
          <Banner />
          <TextInput
            ref={component => (this._textinput = component)}
            onChangeText={text => {
              this.setState({ searchText: text });
              this.query(text, 0);
              this.forceUpdate();
            }}
            placeholder="Search by card name"
            onSubmitEditing={Keyboard.dismiss}
            onFocus={() => {
              this.query(this.state.searchText, 0);
            }}
          />
          <View>
            <ColorPicker
              callback={arg => {
                this.setState({ colors: arg });
                this.query(this.state.searchQuery, 0);
              }}
            />
          </View>
          <View>
            {this.state.searchQuery.length > 0 &&
              matchingCards.length > 0 &&
              <View>
                <Text>
                  Suggestions
                </Text>
                {matchingCards.map((name, index) => (
                  <AutocompleteSuggestion
                    key={name}
                    cardName={name}
                    callback={() => {
                      this.query(name, 0);
                      Keyboard.dismiss();
                    }}
                  />
                ))}
              </View>}

          </View>

          {this.state.searchIsLoaded &&
            this.state.response != null &&
            (this.state.response.similar_cards != null ||
              this.state.response.similar_cards !== undefined) &&
            <View>
              <SearchResults response={this.state.response} />
              <ResultsNavigator
                page={this.state.page}
                previousCallback={() =>
                  this.query(this.state.searchQuery, this.state.page - 2)}
                nextCallback={() =>
                  this.query(this.state.searchQuery, this.state.page)}
              />
            </View>}
          {this.state.searchIsLoaded == false &&
            <ActivityIndicator size="large" />}
        </ScrollView>
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
});

AppRegistry.registerComponent("CodexShredder", () => CodexShredder);
