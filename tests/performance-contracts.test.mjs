import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('SSR uses noop persistence storage and does not gate the application shell', async () => {
  const [storage, provider, store] = await Promise.all([
    read('src/redux/storage.ts'),
    read('src/app/Providers.tsx'),
    read('src/redux/store.ts'),
  ]);

  assert.match(storage, /typeof window === 'undefined'/);
  assert.match(storage, /createNoopStorage/);
  assert.doesNotMatch(provider, /PersistGate/);
  assert.match(store, /typeof window === 'undefined' \? null : persistStore\(store\)/);
});

test('authentication and wishlist requests do not block anonymous page rendering', async () => {
  const [shell, productCard] = await Promise.all([
    read('src/app/ClientProviders.tsx'),
    read('src/components/Products/ProductCard.tsx'),
  ]);

  assert.match(shell, /skip: !user \|\| Boolean\(token\)/);
  assert.doesNotMatch(shell, /if \(isLoading\) return/);
  assert.match(productCard, /useGetWishlistQuery\(undefined, \{ skip: !token \}\)/);
});

test('homepage loads only the active banner and prioritizes the initial LCP image', async () => {
  const banner = await read('src/components/Home/Banner.tsx');

  assert.match(banner, /src=\{banners\[currentIndex\]\.imageUrl\}/);
  assert.match(banner, /priority=\{currentIndex === 0\}/);
  assert.doesNotMatch(banner, /loading="lazy"/);
  assert.doesNotMatch(banner, /banners\.map\(\(banner, index\)/);
});

test('service page uses one cached full-tree query instead of duplicate effects', async () => {
  const servicePage = await read('src/app/[serviceName]/[serviceId]/page.tsx');

  assert.match(servicePage, /useServiceHomeFullTreeQuery/);
  assert.doesNotMatch(servicePage, /useLazyServiceHomeFullTreeQuery/);
  assert.doesNotMatch(servicePage, /fetchCategories/);
});
