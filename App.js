import React, { Component } from 'react'
import { Platform, Text, View, StyleSheet, Image } from 'react-native'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'

export default class App extends Component {
  state = {
    heading: null,
    errorMessage: null
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      })
    } else {
      this._getLocationAsync()
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      })
    } else {
      Location.watchHeadingAsync(data => {
        let heading = this._round(data.trueHeading)
        this.setState({ heading })
      })
    }
  }

  _round = heading => {
    return Math.round(heading)
  }

  render() {
    let text = 'Loading..'
    if (!this.state.heading) {
      if (this.state.errorMessage) {
        text = this.state.errorMessage
      }
      return (
        <View style={styles.container}>
          <Text style={styles.paragraph}>{text}</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Image source={require('./assets/compass.png')} style={{ width: 250, height: 250, transform: [{ rotate: 360 - this.state.heading + 'deg' }] }} />
        <Text style={styles.paragraph}>{this.state.heading}&deg;</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#C9EAED'
  },
  paragraph: {
    margin: 24,
    fontSize: 24,
    textAlign: 'center'
  }
})
