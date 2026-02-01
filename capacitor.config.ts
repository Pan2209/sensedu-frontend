import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.senseedu.app',
  appName: 'SenseEdu',
  webDir: 'www',

  server: {
    androidScheme: 'https'
  }
  
};

export default config;
