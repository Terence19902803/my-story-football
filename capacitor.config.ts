import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.terencedesrues.mystoryfootball',
  appName: 'My Story Football',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e293b",
      showSpinner: false,
      androidSplashResourceName: 'splash',
      iosSpinnerStyle: 'small',
      spinnerColor: '#fbbf24'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e293b',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'native',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#1e293b',
    allowsLinkPreview: false,
    scheme: 'mystoryfootball'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#1e293b'
  }
};

export default config;