interface BuildOption {
  minify?: boolean;
  watch?: boolean;
  noBundle?: boolean;
  splitting?: boolean;
  outdir?: string; // output directory
  root?: string; // project root
  entrypoints: string[];
}

async function build(opts: BuildOption) {
  const buildTypescriptCmd = [
    "bun",
    "build",
    opts.entrypoints.join(" "),
    opts.outdir && `--outdir ${opts.outdir}`,
    opts.watch && "--watch",
    opts.noBundle && "--no-bundle",
    opts.splitting && "--splitting",
    opts.minify && "--minify",
    opts.root && `--root ${opts.root}`,
  ]
    .filter(Boolean)
    .join(" ");

  const buildPublicCmd = "bun scripts/build.public.ts";

  // HACK: Fake how tempalte literal work
  return await Bun.$({
    raw: [[buildTypescriptCmd, buildPublicCmd].join(" | ")],
  } as unknown as TemplateStringsArray);
}

await build({
  entrypoints: ["index.ts"].map((page) => `src/pages/${page}`),
  outdir: "./dist",
  root: "./src",
  watch: true,
});
