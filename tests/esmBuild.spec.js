const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const DIST = path.resolve(__dirname, "..", "dist");
const ESM = path.join(DIST, "esm");

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name))
        : path.join(dir, entry.name),
    );
}

function esmFiles() {
  return walk(ESM).filter((f) => f.endsWith(".js"));
}

describe("ESM build", function () {
  it("marks dist/esm as a module and dist/cjs as commonjs", function () {
    expect(JSON.parse(fs.readFileSync(path.join(ESM, "package.json"), "utf8")))
      .toEqual({ type: "module" });
    expect(
      JSON.parse(fs.readFileSync(path.join(DIST, "cjs", "package.json"), "utf8")),
    ).toEqual({ type: "commonjs" });
  });

  it("emits no bare require() calls", function () {
    const offenders = esmFiles().filter((f) =>
      /\brequire\s*\(/.test(fs.readFileSync(f, "utf8")),
    );
    expect(offenders).toEqual([]);
  });

  it("gives every relative specifier an explicit extension", function () {
    const offenders = [];
    for (const file of esmFiles()) {
      const source = fs.readFileSync(file, "utf8");
      const re = /(?:from|import)\s+["'](\.[^"']*)["']/g;
      let match = re.exec(source);
      while (match) {
        if (!match[1].endsWith(".js")) {
          offenders.push(`${path.relative(ESM, file)} -> ${match[1]}`);
        }
        match = re.exec(source);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("imports cleanly in a real node ESM process", function () {
    const entry = pathToFileURL(path.join(ESM, "index.js")).href;
    const script = `
      import YahooFantasy, { YahooFantasyError } from ${JSON.stringify(entry)};
      const yf = new YahooFantasy("KEY", "SECRET");
      const err = new YahooFantasyError("boom", "CODE", 401);
      console.log(JSON.stringify({
        isFunction: typeof YahooFantasy === "function",
        hasApi: typeof yf.api === "function",
        hasGame: typeof yf.game === "object",
        errorName: err.name,
        hasToJSON: typeof err.toJSON === "function",
      }));
    `;

    const out = execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    expect(JSON.parse(out.trim())).toEqual({
      isFunction: true,
      hasApi: true,
      hasGame: true,
      errorName: "YahooFantasyError",
      hasToJSON: true,
    });
  });

  it("resolves oauth-signature via a default import under real node ESM", function () {
    const script = `
      import oauthSignature from "oauth-signature";
      const signature = oauthSignature.generate(
        "GET",
        "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl",
        { oauth_consumer_key: "KEY", oauth_version: "1.0" },
        "SECRET",
      );
      console.log(JSON.stringify({
        generates: typeof oauthSignature.generate === "function",
        nonEmpty: typeof signature === "string" && signature.length > 0,
      }));
    `;

    const out = execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      encoding: "utf8",
      cwd: path.resolve(__dirname, ".."),
      stdio: ["ignore", "pipe", "pipe"],
    });

    expect(JSON.parse(out.trim())).toEqual({ generates: true, nonEmpty: true });
  });
});
