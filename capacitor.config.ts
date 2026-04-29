import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stayfloow.app',
  appName: 'StayFloow',
  webDir: 'public',
  server: {
    url: 'https://www.stayfloow.com',
    cleartext: true
  }
};

export default config;
