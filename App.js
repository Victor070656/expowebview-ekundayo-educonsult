import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Button,
  Image,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const ref = useRef(null);
  const [networkError, setNetworkError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to manage splash screen

  useEffect(() => {
    // Simulate a delay for the splash screen
    const splashTimeout = setTimeout(() => {
      setIsLoading(false); // Hide splash screen after 3 seconds
    }, 10000);

    return () => clearTimeout(splashTimeout);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (ref.current) {
          ref.current.goBack();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, []);

  const onError = (event) => {
    setNetworkError(true);
  };

  const onRefresh = () => {
    setNetworkError(false);
  };

  // Show the splash screen while loading
  if (isLoading) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
        <StatusBar style="auto" />
        {networkError ? (
          <NetworkErrorScreen onRefresh={onRefresh} />
        ) : (
          <WebView
            ref={ref}
            style={{ flex: 1 }}
            originWhitelist={["*"]}
            source={{
              uri: "https://portal.ekundayoeduconsult.com/my-account/",
            }}
            onError={onError}
            onNavigationStateChange={(navState) => {
              console.log(navState.url);
              ref.current.canGoBack = navState.canGoBack;
            }}
            startInLoadingState={() => <Splash />}
            javaScriptEnabled={true}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const NetworkErrorScreen = ({ onRefresh }) => {
  return (
    <View style={styles.ocontainer}>
      <Text style={[styles.text, { fontSize: 20 }]}>Network Error!</Text>
      <Text style={[styles.text, { marginBottom: 10 }]}>
        Please check your internet connection and try again.
      </Text>
      <Button title="Refresh" onPress={onRefresh} />
    </View>
  );
};

const Splash = () => {
  return (
    <View style={styles.splashContainer}>
      <Image
        source={require("./assets/logo.png")}
        style={styles.splashImage}
        resizeMode="contain"
      />
      <Text
        style={[styles.splashText1, { marginBottom: 3, fontWeight: "bold" }]}
      >
        Welcome To
      </Text>
      <Text style={styles.splashText2}>EKUNDAYO</Text>
      <Text style={styles.splashText3}>EDUCONSULT</Text>
      <Text style={styles.splashText1}>
        We are dedicated to providing professionals certifications in various
        areas of personal development
      </Text>
      <View style={{ height: 20 }}></View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ocontainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 10,
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  splashImage: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  splashText1: {
    fontSize: 18,

    textAlign: "center",
  },
  splashText2: {
    fontSize: 40,
    lineHeight: 41,
    fontWeight: "900",
    textAlign: "center",
    fontFamily: "serif",
    color: "#a9cf46",
  },
  splashText3: {
    fontSize: 28,
    lineHeight: 29,
    fontWeight: "900",
    textAlign: "center",
    fontFamily: "serif",
  },
  text: {
    color: "#000",
    fontSize: 15,
    fontWeight: "800",
  },
});
