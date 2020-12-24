import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Button, Text} from 'react-native-elements';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';

const App = () => {

  const [state, setState] = useState({
    inflationRate: 0,
    riskFreeRate: 0,
    amount: 0,
    timeInYears: 1,
    afterInflation: 0,
    atRiskFree: 0,
    atRiskFreeAfterInflation: 0,
    difference: 0
  });

  const calculateInflationImpact = (value, inflationRate, time) => {
    return value / Math.pow(1 + inflationRate, time);
  };

  const calculate = () => {
    let afterInflation = calculateInflationImpact(state.amount, state.inflationRate / 100, state.timeInYears);
    let atRiskFree = state.amount * Math.pow(1 + state.riskFreeRate / 100, state.timeInYears);
    let atRiskFreeAfterInflation = calculateInflationImpact(atRiskFree, state.inflationRate / 100, state.timeInYears);
    let difference = atRiskFreeAfterInflation - afterInflation;

    setState({
      ...state,
      afterInflation,
      atRiskFree,
      atRiskFreeAfterInflation,
      difference
    });
  };

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
          <Text h1 style={{marginVertical: 15}}>Inflation Calc</Text>
        <Input placeholder="Current inflation rate"
               keyboardType='decimal-pad'
               onChangeText={(inflationRate) => setState({...state, inflationRate})}/>
        <Input placeholder="Current risk free rate"
               keyboardType='decimal-pad'
               onChangeText={(riskFreeRate) => setState({...state, riskFreeRate})}/>
        <Input placeholder="Amount you want to save"
               keyboardType='decimal-pad'
               onChangeText={(amount) => setState({...state, amount})}/>
        <Input placeholder="For how long (in years) will you save?"
               keyboardType='decimal-pad'
               onChangeText={(timeInYears) => setState({...state, timeInYears})}/>

        <Button title="Calculate inflation"
                style={{marginVertical: 15}}
                onPress={() => {
                  calculate();
                  Analytics.trackEvent('calculate_inflation', {Internet: 'WiFi', GPS: 'Off'});
                }}/>

        <Text>{state.timeInYears} years from now you will still have ${state.amount} but it
          will only be worth ${state.afterInflation}.</Text>
        <Text>But if you invest it at a risk free rate you will have
          ${state.atRiskFree}.</Text>
        <Text>Which will be worth ${state.atRiskFreeAfterInflation} after inflation.</Text>
        <Text>A difference of: ${state.difference}.</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
});

export default App;
