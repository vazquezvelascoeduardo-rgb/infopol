import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.infopol.mossos',
  appName: 'InfoPol',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'automatic',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#F6F4EF',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#F6F4EF',
    },
  },
};

export default config;
