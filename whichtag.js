'use strict';

var minimist = require('minimist'),
    execSync = require('child_process').execSync;

var args = minimist(process.argv.slice(2), {
  alias: { n: 'name', h: 'hash', help: 'help' }
});

var hash = args.hash;
var authorName = args.name;

if (args.help) {
    console.log(`
options:
-n, --name 
    Author name
-h, --hash 
    commit hash
--help 
    this message

examples:

> node whichtag.js
returns the tag which contains the last commit of the current author

> node whichtag.js -n abhishek
returns the tag which contains the last commit of the aurhor by name abhishek

> node whichtag.js -h fb4ef5598c2b53
returns the tag which contains the commit fb4ef5598c2b53`);
    return;
}

if (!authorName) {
    authorName = execSync(`git config user.email`).toString().trim();
}

if (!hash) {
    try {
        hash = execSync(`git log -1 --author=${authorName} --format="%H"`).toString().trim();
    } catch (e) {
        console.log(e.message);
        return;
    }
} 

var lastCommit = execSync(`git show ${hash} --name-only`).toString();

console.log(' == Last Commit == ');
console.log(lastCommit);

if (hash.length) {
    var tagNames = execSync(`git tag --contains ${hash}`).toString().trim();

    if (tagNames.length) {
        console.log(` == Tags containing commit ${hash} == `);
        console.log( tagNames);
    } else {
        console.log(` xx No tag found with the commit ${hash} xx `);
    }

}

