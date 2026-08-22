import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const customBazarSource = await readFile(
  new URL('../src/features/custom-bazar/CustomBazar.tsx', import.meta.url),
  'utf8'
);

test('custom bazar options use defined, unique keys and unambiguous values', () => {
  assert.match(
    customBazarSource,
    /category\.subcategories\?\.map\(\(sub, subcategoryIndex\) =>/
  );
  assert.match(customBazarSource, /key=\{`\$\{category\._id\}-\$\{subcategoryIndex\}`\}/);
  assert.match(customBazarSource, /value=\{subcategoryIndex\}/);
  assert.doesNotMatch(customBazarSource, /<option key=\{sub\._id\}/);
});
