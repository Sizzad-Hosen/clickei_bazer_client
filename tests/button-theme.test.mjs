import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('default and secondary buttons share the Login amber theme', async () => {
  const button = await read('src/components/ui/button.tsx');

  assert.match(button, /const primaryButtonStyles/);
  assert.match(button, /default:\s*primaryButtonStyles/);
  assert.match(button, /secondary:\s*primaryButtonStyles/);
  assert.match(button, /bg-amber-500/);
  assert.match(button, /hover:bg-amber-600/);
  assert.match(button, /outline:[\s\S]*?border-amber-600/);
  assert.match(button, /ghost:[\s\S]*?text-amber-800/);
  assert.match(button, /link:\s*"text-amber-700/);
});

test('primary page actions do not override the shared theme with blue or green', async () => {
  const sources = await Promise.all([
    read('src/components/Carts/CartDrawer.tsx'),
    read('src/app/profile/page.tsx'),
    read('src/app/track-order/page.tsx'),
    read('src/features/custom-bazar/CustomBazar.tsx'),
  ]);

  for (const source of sources) {
    assert.doesNotMatch(source, /bg-(?:blue|green)-[5-9]00/);
  }
});
