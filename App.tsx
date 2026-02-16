import React, { useState, useRef } from 'react';
import {View,Text,TouchableOpacity,FlatList,StyleSheet,ImageBackground,Animated,Dimensions,Platform} from 'react-native';

const { width, height } = Dimensions.get('window');

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spinValue = useRef(new Animated.Value(0)).current;

const startStop = () => {
  if (running) {
    // Stop and Reset
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime(0);
    setLaps([]);
  } else {
    // Start
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 10);
    }, 10);
  }
};


  const pause = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime(0);
    setLaps([]);
  };

  const handleReset = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== "web"
    }).start();
    stop();
  };

  const lap = () => {
    setLaps([...laps, time]);
  };

  const clearLaps = () => {
    setLaps([]);
  };

  const deleteLap = (index: number) => {
    setLaps(laps.filter((_, i) => i !== index));
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>

        <Text style={styles.timer}>{formatTime(time)}</Text>

        <View style={styles.startResetRow}>
          <TouchableOpacity style={styles.mainButton} onPress={startStop}>
            <Text style={styles.mainButtonText}>
              {running ? "Stop" : "Start"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Animated.Text style={[styles.resetIcon, { transform: [{ rotate: spin }] }]}>
              ↻
            </Animated.Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.smallButton} onPress={pause}>
            <Text style={styles.smallButtonText}>Pause</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallButton} onPress={lap}>
            <Text style={styles.smallButtonText}>Lap</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallButton} onPress={clearLaps}>
            <Text style={styles.smallButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={laps}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => deleteLap(index)}>
              <Text style={styles.lapText}>
                Lap {index + 1}: {formatTime(item)}
              </Text>
            </TouchableOpacity>
          )}
        />

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: height * 0.20   // ⭐ moves timer lower
  },

  timer: {
    fontSize: Math.min(width * 0.18, 90),
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 30
  },

  startResetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },

  mainButton: {
    backgroundColor: 'rgba(68, 68, 68, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginRight: 20
  },

  mainButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },

  resetButton: {
    backgroundColor: 'rgba(68, 68, 68, 0.6)',
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  resetIcon: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold'
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25
  },

  smallButton: {
    backgroundColor: 'rgba(68, 68, 68, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 6
  },

  smallButtonText: {
    color: 'white',
    fontSize: 16
  },

  lapText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 8
  }
});

export default App;