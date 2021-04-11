/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';



const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [location, setLocation] = useState({});

  const hasLocationPermissionsIOS = async (): Promise<boolean> => {
    const openSettings = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');
    if (status === 'granted') {
      return true;
    }
    if (status === 'denied') {
      Alert.alert('Location Permission was denied');
    }
    if (status === 'disabled') {
      Alert.alert(
        'Turn on Location Services to allow this app to determine your location.',
        '',
        [
          {text: 'Go to Settings', onPress: openSettings},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }
    return false;
  };
  
  const hasLocationPermissions = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasLocationPermissionsIOS();
      return hasPermission;
    }
  
    // We assume that location permission is already granted by user under 23 level for android
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
  
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
  
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
  
    return false;
  };
  
  const getLocation = async () => {
    const hasPermission = await hasLocationPermissions();
    if (!hasPermission) {
      return;
    }
  
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
      },
    );
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  getLocation();

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          <Text>Your location is:</Text>
          <Text>Latitude: {location?.coords?.latitude || ''}</Text>
          <Text>Longitude: {location?.coords?.latitude || ''}</Text>
          <Pressable
            onPress={async () => {
              await getLocation();
            }}>
            <Text>Get Location</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
});

export default App;
