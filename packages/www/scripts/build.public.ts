import { watch, readdir } from "fs";
import { join } from "path";

const OUTDIR = "./dist";
const DIR = join(import.meta.dir, "..");

readdir(DIR, { recursive: true }, (_err, files) => {
  for (const filename of files) {
    typeof filename == "string" && watchFilename(filename);
  }
});

const watcher = watch(DIR, { recursive: true }, async (_event, filename) => {
  filename && watchFilename(filename);
});

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();
  process.exit(0);
});

function watchFilename(filename: string) {
  if (filename.match(/^public[\\/]/)) {
    copyFile(filename, filename.replace(/^public/, OUTDIR));
  }
}

function copyFile(path: string, outpath: string) {
  const file = Bun.file(path);
  Bun.write(outpath, file);
}
