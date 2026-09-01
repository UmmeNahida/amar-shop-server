const path = require("path");
const fs = require("fs");

const outdir = path.join(__dirname, "../dist");

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8"));
const external = [...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.peerDependencies || {})];

if (fs.existsSync(outdir)) {
  fs.rmSync(outdir, { recursive: true, force: true });
}

fs.mkdirSync(outdir, { recursive: true });

async function build() {
  try {
    const result = await Bun.build({
      entrypoints: ["./src/server.ts"],
      outdir: "./dist",
      target: "node",
      format: "cjs",
      sourcemap: "external",
      minify: false,
      external,
    });

    if (!result.success) {
      console.error("Build failed:");
      result.logs.forEach((log) => console.error(log));
      process.exit(1);
    }

    console.log("Build successful! Single file created at dist/server.js");
    const size = (fs.statSync("./dist/server.js").size / 1024).toFixed(2);
    console.log(`Bundle size: ${size} KB`);
    console.log(`External dependencies: ${external.length}`);
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();