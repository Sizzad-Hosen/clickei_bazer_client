import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('navbar publishes its rendered height and stays above dashboard layers', async () => {
  const [navbar, globals] = await Promise.all([
    read('src/components/shared/Navbar.tsx'),
    read('src/app/globals.css'),
  ]);

  assert.match(globals, /--app-navbar-height:\s*0px/);
  assert.match(navbar, /new ResizeObserver\(updateNavbarHeight\)/);
  assert.match(navbar, /--app-navbar-height/);
  assert.match(navbar, /sticky top-0 z-\[100\]/);
});

test('dashboard desktop layout uses a non-overlapping responsive grid', async () => {
  const dashboard = await read('src/app/dashboard/layout.tsx');

  assert.match(dashboard, /md:grid-cols-\[17rem_minmax\(0,1fr\)\]/);
  assert.match(dashboard, /sticky hidden self-start/);
  assert.match(dashboard, /top: 'var\(--app-navbar-height\)'/);
  assert.match(dashboard, /height: 'calc\(100dvh - var\(--app-navbar-height\)\)'/);
  assert.doesNotMatch(dashboard, /inset-y-0/);
});

test('dashboard mobile drawer closes accessibly and locks background scrolling', async () => {
  const [dashboard, navigation] = await Promise.all([
    read('src/app/dashboard/layout.tsx'),
    read('src/components/dashboard/DashboardNavigation.tsx'),
  ]);

  assert.match(dashboard, /document\.body\.style\.overflow = 'hidden'/);
  assert.match(dashboard, /event\.key === 'Escape'/);
  assert.match(dashboard, /transition-opacity duration-300/);
  assert.match(dashboard, /transition-transform duration-300 ease-out/);
  assert.match(dashboard, /onClick=\{closeSidebar\}/);
  assert.match(dashboard, /<DashboardNavigation onNavigate=\{closeSidebar\}/);
  assert.match(navigation, /onClick=\{onNavigate\}/);
});
