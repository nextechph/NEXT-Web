import { defineConfig } from '@playwright/test';
import fs from 'node:fs';
const brave='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
export default defineConfig({
    testDir:'./tests',testMatch:'**/*.spec.mjs',fullyParallel:false,workers:1,timeout:30000,
    use:{baseURL:'http://127.0.0.1:3000',headless:true,launchOptions:{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH||(fs.existsSync(brave)?brave:undefined)}},
    webServer:{command:'node tests/start-preview.mjs',url:'http://127.0.0.1:3000',reuseExistingServer:false,timeout:60000}
});
