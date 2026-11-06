import { ChakraPetch_400Regular, ChakraPetch_500Medium, ChakraPetch_600SemiBold, ChakraPetch_700Bold, useFonts } from '@expo-google-fonts/chakra-petch';
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '../store';
import { fetchWords } from '../store/wordsSlice';
import { colors } from '../theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    ChakraPetch_400Regular,
    ChakraPetch_500Medium,
    ChakraPetch_600SemiBold,
    ChakraPetch_700Bold,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });
  useEffect(() => {
    store.dispatch(fetchWords());
  }, []);
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);
  if (!loaded) return null;

  return (
    <Provider store={store}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="sign-up" />
          <Stack.Screen name="level-setup" />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="lesson/word" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
          <Stack.Screen name="lesson/quiz" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
          <Stack.Screen name="lesson/complete" options={{ animation: 'fade', gestureEnabled: false }} />
        </Stack>
      </View>
    </Provider>
  );
}
