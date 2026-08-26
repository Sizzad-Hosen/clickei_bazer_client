import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const viewports = [
  [320, 568], [360, 800], [375, 812], [390, 844], [414, 896],
  [768, 1024], [820, 1180], [1024, 768], [1280, 720], [1366, 768],
  [1440, 900], [1536, 864], [1920, 1080],
];

test('responsive matrix is represented by mobile-first layout contracts', async (t) => {
  const [home, dashboard, dialog, table] = await Promise.all([
    read('src/components/Home/Home.tsx'),
    read('src/app/dashboard/layout.tsx'),
    read('src/components/ui/dialog.tsx'),
    read('src/components/ui/table.tsx'),
  ]);

  for (const [width, height] of viewports) {
    await t.test(`${width}x${height}`, () => {
      assert.match(home, /min-w-0 max-w-full/);
      assert.match(dashboard, /max-w-\[calc\(100vw-2rem\)\]/);
      assert.match(dialog, /max-h-\[calc\(100dvh-2rem\)\]/);
      assert.match(table, /overflow-x-auto/);
    });
  }
});

test('global styles do not conceal overflow defects', async () => {
  const css = await read('src/app/globals.css');
  assert.doesNotMatch(css, /overflow-x\s*:\s*hidden/);
});

test('mobile navigation supports keyboard dismissal', async () => {
  const [navbar, sidebar, dashboard] = await Promise.all([
    read('src/components/shared/Navbar.tsx'),
    read('src/components/shared/Sidebar.tsx'),
    read('src/app/dashboard/layout.tsx'),
  ]);
  for (const source of [navbar, sidebar, dashboard]) {
    assert.match(source, /event\.key === ['"]Escape['"]/);
  }
});

test('mobile header aligns service toggle, logo, and account menu', async () => {
  const [navbar, sidebar] = await Promise.all([
    read('src/components/shared/Navbar.tsx'),
    read('src/components/shared/Sidebar.tsx'),
  ]);
  assert.match(navbar, /grid-cols-\[2\.5rem_1fr_auto\]/);
  assert.match(sidebar, /fixed left-3 top-2/);
});

test('mobile services drawer keeps Custom Bazar above the navbar layer', async () => {
  const sidebar = await read('src/components/shared/Sidebar.tsx');
  assert.match(sidebar, /href="\/customBazar"/);
  assert.match(sidebar, /z-\[120\]/);
  assert.match(sidebar, /pt-14/);
});

test('site metadata uses ClickeiBazer branding for browser icons', async () => {
  const appLayout = await read('src/app/layout.tsx');
  assert.match(appLayout, /icon:\s*"\/clickeiBazer-png\.png"/);
  assert.doesNotMatch(appLayout, /next\.svg/);
});

test('homepage product collections show two cards on mobile', async () => {
  const [recommended, wishlist] = await Promise.all([
    read('src/components/Home/SubCategoryWiseProducts.tsx'),
    read('src/components/Home/HomeWishList.tsx'),
  ]);
  assert.match(recommended, /grid grid-cols-2/);
  assert.match(wishlist, /grid grid-cols-2/);
});

test('only App Router route files remain', async () => {
  await assert.rejects(read('src/pages/_app.tsx'));
  const appLayout = await read('src/app/layout.tsx');
  assert.match(appLayout, /ClientProviders/);
});
