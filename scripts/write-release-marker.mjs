import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
// Runs only in the publisher before Astro builds. Contains no secrets.
const sha=String(process.env.GITHUB_SHA||'local').trim();
const release={
  sourceCommit:/^[0-9a-f]{40}$/.test(sha)?sha:'local',
  sourceBranch:'feature/initial-site-and-tools',
  design:'illustrated-28-tools',
  toolCardCount:28,
  builtAt:new Date().toISOString()
};
mkdirSync(resolve('public'),{recursive:true});
writeFileSync(resolve('public/release.json'),JSON.stringify(release,null,2)+'\n');
console.log('Generated public release marker for source',release.sourceCommit);
