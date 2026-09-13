// inside a CommonJS file (no "type": "module" in package.json)
async function loadEsmDependency() {
  const { default: esmThing } = await import('./esm-only-package.mjs');
  return esmThing;
}
