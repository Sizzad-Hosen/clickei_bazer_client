import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('admin product forms use the backend inventory contract', async () => {
  const [createForm, editForm] = await Promise.all([
    read('src/features/products/CreateProduct.tsx'),
    read('src/components/Products/EditProductModal.tsx'),
  ]);

  for (const source of [createForm, editForm]) {
    assert.match(source, /quantity:/);
    assert.doesNotMatch(source, /stock:/);
    assert.doesNotMatch(source, /sizes:/);
  }
});

test('dashboard shell enforces the admin role', async () => {
  const dashboard = await read('src/app/dashboard/layout.tsx');
  assert.match(dashboard, /<ProtectedRoute allowedRoles=\{\['admin'\]\}>/);
});

test('access tokens are not persisted to localStorage', async () => {
  const store = await read('src/redux/store.ts');
  assert.match(store, /whitelist: \['user'\]/);
  assert.doesNotMatch(store, /whitelist: \[[^\]]*'token'/);
});

test('core shells retain mobile overflow safeguards', async () => {
  const [appShell, dashboard, navbar] = await Promise.all([
    read('src/app/ClientProviders.tsx'),
    read('src/app/dashboard/layout.tsx'),
    read('src/components/shared/Navbar.tsx'),
  ]);
  assert.match(appShell, /min-w-0 max-w-full/);
  assert.match(dashboard, /min-w-0 max-w-full/);
  assert.match(navbar, /max-w-\[calc\(100vw-2rem\)\]/);
});
