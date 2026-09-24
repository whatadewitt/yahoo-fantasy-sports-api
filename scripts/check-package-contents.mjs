// Fails if `npm publish` would ship anything unexpected.
//
// Publishing 5.3.1 would have included a local .env holding the Yahoo consumer
// key and secret, plus the whole dist/ build from the TypeScript branch: 415
// files against the 82 that 5.3.0 shipped. The package had no "files" field and
// no .npmignore, so npm fell back to .gitignore, which covered neither. It was
// caught by running a dry run by hand, which is not a process.
//
// The "files" allowlist in package.json is the actual fix. This is the check
// that it stays in place and keeps working.

import { execFileSync } from "child_process";
import { readFileSync } from "fs";

// Allowed at the top level of the tarball. Directories are allowed wholesale,
// so adding helpers/newThing.mjs needs no change here, but a new top-level
// entry is a deliberate decision and has to be made here.
const ALLOWED = new Set([
  "LICENSE",
  "README.md",
  "package.json",
  "index.js",
  "YahooFantasy.mjs",
  "collections",
  "helpers",
  "resources",
]);

// Belt and braces: these must never appear at any depth, even inside an
// allowed directory.
const NEVER = [
  /(^|\/)\.env($|\..*)/,
  /(^|\/)\.npmrc$/,
  /(^|\/)\.git($|\/)/,
  /(^|\/)node_modules($|\/)/,
  /\.pem$/,
  /\.key$/,
  /(^|\/)id_rsa/,
];

const fail = (msg) => {
  console.error(`\n  FAIL  ${msg}`);
  process.exitCode = 1;
};

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

if (!Array.isArray(pkg.files) || 0 === pkg.files.length) {
  fail(
    'package.json has no "files" allowlist. Without it npm falls back to\n' +
      "        .gitignore and any untracked local file can be published."
  );
}

const out = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
const paths = JSON.parse(out)[0].files.map((f) => f.path);

for (const p of paths) {
  const top = p.split("/")[0];

  if (!ALLOWED.has(top)) {
    fail(
      `"${p}" would be published but "${top}" is not in the allowlist.\n` +
        "        Add it to ALLOWED in this script if that is intended, or keep it\n" +
        '        out of the "files" field in package.json.'
    );
  }

  for (const pattern of NEVER) {
    if (pattern.test(p)) {
      fail(`"${p}" must never be published.`);
    }
  }
}

if (process.exitCode) {
  console.error(`\n  ${paths.length} files would be published:`);
  for (const p of paths) console.error(`    ${p}`);
  console.error("");
} else {
  console.log(`  ok  ${paths.length} files, all within the allowlist`);
}
