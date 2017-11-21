import React from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { Constants, Location, Permissions } from 'expo';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGPSLocation: null,
      pastGPSLocations: []
    };
  };

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    } else{
      let currentGPSLocation = await Location.getCurrentPositionAsync({});
      let parsedGPSLocation = {
        latitude: currentGPSLocation.coords.latitude,
        longitude: currentGPSLocation.coords.longitude,
      }
      pastGPSLocations = this.state.pastGPSLocations + currentGPSLocation;
      this.setState({
        currentGPSLocation: parsedGPSLocation,
        pastGPSLocations: pastGPSLocations,
      });
    }
  };

  _postToServerAsync = async() => {
    console.log("POST to server")
  };
  render() {
    let text = "Loading Latitude and Longitude...";
    let postDisabled = true;
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.currentGPSLocation) {
      text = "Latitude: " + this.state.currentGPSLocation.latitude + "\nLongitude: " + this.state.currentGPSLocation.longitude
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
