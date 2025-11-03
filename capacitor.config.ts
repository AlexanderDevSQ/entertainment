import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Entertainment',
  webDir: 'www',
  plugins: {
    StatusBar: {
      style: 'DARK',
      overlaysWebView: false,
    }
  }
};

export default config;
