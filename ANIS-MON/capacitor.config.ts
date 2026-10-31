import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tj.anismon.security',
  appName: 'ANIS MON',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: { androidScheme: 'https' }
};

export default config;