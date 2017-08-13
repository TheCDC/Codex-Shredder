import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Clipboard
} from "react-native";

const COLORCOLORS = {
  W: "#FFF9D6",
  U: "#5EBEFF",
  B: "#000000",
  R: "#FF0000",
  G: "#1FAA00"
};

function scryfallLink(card) {
  let url =
    "http://scryfall.com/search?" +
    queryString.stringify({ q: card.name + " mana:" }) +
    card.manaCost;
  return url;
}

const queryString = require("query-string");

export default class CardCard extends Component {
  constructor(props) {
    super(props);
  }

  copyCardDialog(card) {
    Alert.alert("Copy " + card.name, "Copy full card name or full text", [
      {
        text: "Name",
        onPress: () => {
          Clipboard.setString(card.name);
        }
      },
      {
        text: "Text",
        onPress: () => {
          Clipboard.setString(
            [
              card.name,
              card.manaCost,
              card.type,
              card.set.code + "(" + card.set.name + ")",
              card.text,
              card.power && card.power + "/" + card.toughness,
              card.loyalty
            ].join("\n")
          );
        }
      }
    ]);
  }

  render() {
    const card = this.props.card;
    return (
      <TouchableOpacity
        onPress={() => Linking.openURL(scryfallLink(card))}
        onLongPress={() => this.copyCardDialog(card)}
        style={styles.cardCard}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >

            <View
              style={{
                width: 75,
                flexDirection: "row",
                backgroundColor: "#DFDFDF",
                justifyContent: "flex-start",
                height: 15,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10
              }}
            >
              {card.colorIdentity &&
                card.colorIdentity.map((item, index) => (
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      backgroundColor: COLORCOLORS[item],
                      borderRadius: 10,
                      borderColor: "#000000",
                      borderWidth: 1
                    }}
                    key={index}
                  />
                ))}
            </View>
            <Text style={[styles.cardText]}>
              {card.name}
            </Text>
            <Text style={[styles.cardText]}>
              {card.manaCost}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={[styles.cardText, styles.cardTextBody]}>
              {card.supertypes && card.supertypes.join(" ")}
              {" "}
              {card.types.join(" ")}
              {" "}
              -
              {" "}
              {card.subtypes && card.subtypes.join(" ")}
            </Text>
            <Text
              style={[
                styles.cardText,
                styles.cardTextBody,
                { textAlign: "center" }
              ]}
            >
              {card.set.code} ({card.set.name})
            </Text>

          </View>
          <Text style={[styles.cardText, styles.cardTextBody]}>
            {card.text}
            {card.power && <Text> | {card.power}/{card.toughness}</Text>}
            {card.loyalty && "\n" + card.loyalty}

          </Text>
        </View>

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardCard: {
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#000000",
    margin: 3,
    padding: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardText: {
    fontSize: 17,
    color: "#000000",
    flex: 1,
    textAlign: "center"
  },
  cardTextBody: {
    margin: 0,
    padding: 1,
    textAlign: "left"
  }
});
