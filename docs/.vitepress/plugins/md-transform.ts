// import fs from 'fs';
import path from 'path';
// import glob from 'fast-glob';
// import { docRoot, docsDirName, projRoot } from '../utils/path';

import type { Plugin } from 'vite';

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>;

export function MarkdownTransform(): Plugin {
    return {
        name: 'hyper-ui-md-transform',
        enforce: 'pre',
        async transform(code: string, id: string) {
            if(!id.endsWith('.md')) return;
            if(/guide/.test(id)) return;
            const componentId = path.basename(id, '.md');

            if(componentId === 'index') return;

            const append: Append = {
                headers: [],
                footers: [],
                scriptSetups: [
                    `const demos = import.meta.globEager('../../examples/${componentId}/*.vue')`
                ]
            };

            code = transformVpScriptSetup(code, append);

            // const pattern = 'zh-CN/component';
            // const compPaths = await glob(pattern, {
            //     cwd: docRoot,
            //     absolute: true,
            //     onlyDirectories: true
            // });
            // if(compPaths.some(compPath => id.startsWith(compPath)))
            //     code = transformComponentMarkdown(id, componentId, code, append);

            return combineMarkdown(
                code,
                [combineScriptSetup(append.scriptSetups), ...append.headers],
                append.footers
            )
        }    
    }
};

const combineScriptSetup = (codes: string[]) => `\n<script setup>${codes.join('\n')}</script>`;

const combineMarkdown = (
    code: string,
    headers: string[],
    footers: string[]
) => {
    const frontmatterEnds = code.indexOf('---\n\n') + 4;
    const firstSubheader = code.search(/\n## /);
    const sliceIndex = firstSubheader < 0 ? frontmatterEnds : firstSubheader;

    if(headers.length > 0) 
        code =
          code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex);
    
    code += footers.join('\n');
    
    return `${code}\n`;
};

const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S*])<\/vp-script>/;

const transformVpScriptSetup = (code: string, append: Append) => {
    const matches = code.match(vpScriptSetupRE);
    if(matches) code = code.replace(matches[0], '');
    const scriptSetup = matches?.[3] ?? '';
    if(scriptSetup) append.scriptSetups.push(scriptSetup);
    return code;
};

// const transformComponentMarkdown = (
//     id: string,
//     compoenntId: string,
//     code: string,
//     append: Append
// ) => {
//     const lang = 'zh-CN';
//     const component
//     // Component Page Footers Transform
// }