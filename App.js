import React from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { Constants, Location, Permissions } from 'expo';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  componentWillMount() {
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
    }

    let currentGPSLocation = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    pastGPSLocations = this.state.pastGPSLocations + currentGPSLocation;
    this.setState({ currentGPSLocation: currentGPSLocation,
      pastGPSLocations: pastGPSLocations,
    });
  };

  render() {
    let text = "Loading Latitude and Longitude..."
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.currentGPSLocation);
    }
    return (
      <View style={styles.container}>
        <Button 
          onPress={this._getLocationAsync}
          title="Pull Current Latitude and Longitude"
          color="#841584"
        />
        <Text>{text}</Text>
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
