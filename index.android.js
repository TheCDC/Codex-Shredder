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
import CardCard from "./CardCard";
import AutocompleteSuggestion from "./AutocompleteSuggestion";

var cardsObj = require("./res/cards.json");

function scryfallLink(card) {
  let url =
    "http://scryfall.com/search?" +
    queryString.stringify({ q: card.name + " mana:" }) +
    card.manaCost;
  return url;
}

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
              this.state.matchingCards.length > 0 &&
              this.state.matchingCards[0] !== this.state.searchQuery &&
              <View>
                <Text>
                  Suggestions
                </Text>

                {this.state.matchingCards
                  .slice(0, 10)
                  .map((cardName, index) => (
                    <AutocompleteSuggestion
                      key={index}
                      cardName={cardName}
                      callback={() => {
                        this.query(cardName, 0);
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
              <View style={styles.cardSearchNavbar}>
                {this.state.page > 1
                  ? <TouchableOpacity
                      onPress={() =>
                        this.query(this.state.searchQuery, this.state.page - 2)}
                    >
                      <Text
                        style={[styles.pageNavButton, styles.navButtonText]}
                      >
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
                <TouchableOpacity
                  onPress={() =>
                    this.query(this.state.searchQuery, this.state.page)}
                >

                  <Text style={[styles.pageNavButton, styles.navButtonText]}>

                    {this.state.page + 1}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>}
          {this.state.searchIsLoaded == false &&
            <ActivityIndicator size="large" />}
        </ScrollView>
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
  cardCompleteSuggestion: {
    backgroundColor: "#AAAAFF",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#AAAAFF",
    color: "#000000",
    margin: 1,
    fontSize: 17,
    paddingHorizontal: 3
  },
  searchedCard: {
    backgroundColor: "wheat"
  },
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

AppRegistry.registerComponent("CodexShredder", () => CodexShredder);
