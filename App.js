/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {StyleSheet, View, Button} from 'react-native';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';

const App = () => {
  const checkPreviousSession = async () => {
    const didCrash = await Crashes.hasCrashedInLastSession();
    if (didCrash) {
      const report = await Crashes.lastSessionCrashReport();
      alert("Sorry about the crash " + JSON.stringify(report));
    }
  };

  useEffect(() => {
    checkPreviousSession();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Crash" onPress={() => Crashes.generateTestCrash() }/>

      <Button title="Calculate Inflation" onPress={() => Analytics.trackEvent('calculate_inflation', { Internet: 'WiFi', GPS: 'Off'}) }/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },
});

export default App;
