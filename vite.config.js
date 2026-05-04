import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/SlotSync/',
  plugins: [react()],
  build: { outDir: 'dist' },
});
