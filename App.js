import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Button,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const ref = useRef(null);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (ref.current) {
          ref.current.goBack();
          return true;
          // prevent default exiting app
        }
        return false;
        // Default behaviour (exit app if no history or webview)
      }
    );
    return () => backHandler.remove();
    // cleanup listener on component unmount
  }, []);

  const [networkError, setNetworkError] = useState(false);

  const onError = (event) => {
    setNetworkError(true);
  };

  const onRefresh = () => {
    setNetworkError(false);
  };

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
            startInLoadingState={() => (
              <View style={{ flex: 1 }}>
                <ActivityIndicator size={"large"} color={"#00f"} />
              </View>
            )}
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
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
