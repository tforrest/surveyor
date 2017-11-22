import React from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";
import { Constants, Location, Permissions } from "expo";
import { Config } from "react-native-config";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null
    };
  }

  componentDidMount() {
    if (Platform.OS === "android" && !Constants.iscleDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    } else {
      let rawLocation = await Location.getCurrentPositionAsync({});
      this.setState({
        location: {
          latitude: rawLocation.coords.latitude,
          longitude: rawLocation.coords.longitude
        }
      });
    }
  };

  _postToServerAsync = async () => {
    let data = this._getCurrentGrid();
    console.log(Config.API_URL);
    fetch(Config.API_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(
      function(response) {
        if (response.status !== 200) {
          console.log("POST Success");
        } else {
          console.log("POST failed " + response.statusText);
        }
      },
      function(error) {
        console.log("Request failed");
        console.log(error.message);
      }
    );
  };

  _getCurrentGrid() {
    return {
      centerLatitude: this.state.location.latitude,
      centerLongitude: this.state.location.longitude
    };
  }

  render() {
    let text = "Loading Latitude and Longitude...";
    let postDisabled = true;
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text =
        "Latitude: " +
        this.state.location.latitude +
        "\nLongitude: " +
        this.state.location.longitude;
      postDisabled = false;
    }
    return (
      <View style={styles.container}>
        <Text>{text}</Text>
        <Button
          onPress={this._getLocationAsync}
          title="Pull Current Location"
          color="#841584"
        />
        <Button
          onPress={this._postToServerAsync}
          title="Post Grid to Server"
          disabled={postDisabled}
          color="#008000"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
