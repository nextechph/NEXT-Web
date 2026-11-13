import { spawn } from 'node:child_process';
import { startFixtureServer } from './fixtures.mjs';
const server=await startFixtureServer();
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3000'],{stdio:'inherit',env:{...process.env,NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:45451'}});
function stop(){child.kill('SIGTERM');server.close();}
process.on('SIGTERM',stop);process.on('SIGINT',stop);child.on('exit',code=>{server.close();process.exit(code||0);});
