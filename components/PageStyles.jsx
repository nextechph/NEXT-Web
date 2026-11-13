import fs from 'node:fs';
import path from 'node:path';
export default function PageStyles({name}) {
    const file = path.join(process.cwd(),'legacy',`${name}.css`);
    return fs.existsSync(file) ? <style dangerouslySetInnerHTML={{__html:fs.readFileSync(file,'utf8')}}/> : null;
}
