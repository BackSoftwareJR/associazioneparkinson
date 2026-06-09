'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let failures = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`not ok - ${name}`);
    console.error(`  ${error.message}`);
  }
}

const htmlFiles = fs
  .readdirSync(root, { withFileTypes: true })
  .flatMap((entry) => {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      return [path.join(root, entry.name)];
    }
    if (entry.isDirectory() && entry.name === 'sedi') {
      return fs
        .readdirSync(path.join(root, 'sedi'))
        .filter((name) => name.endsWith('.html'))
        .map((name) => path.join(root, 'sedi', name));
    }
    return [];
  });

test('all HTML pages include a favicon', () => {
  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, 'utf8');
    assert(html.includes('rel="icon"'), `Missing favicon in ${path.basename(filePath)}`);
  }
});

test('all HTML pages use the same asset cache version', () => {
  const cssVersions = new Set();
  const jsVersions = new Set();

  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, 'utf8');
    const cssMatch = html.match(/style\.css\?v=(\d+)/);
    const jsMatch = html.match(/main\.js\?v=(\d+)/);

    if (cssMatch) cssVersions.add(cssMatch[1]);
    if (jsMatch) jsVersions.add(jsMatch[1]);
  }

  assert(cssVersions.size === 1, `Expected one CSS version, found: ${[...cssVersions].join(', ')}`);
  assert(jsVersions.size === 1, `Expected one JS version, found: ${[...jsVersions].join(', ')}`);
});

test('main navigation labels are consistent across pages', () => {
  const expectedLabels = [
    'Home',
    'Chi Siamo',
    'Sedi',
    'Attività',
    'News',
    'Progetto Africa',
    'Contatti',
  ];

  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, 'utf8');
    for (const label of expectedLabels) {
      assert(html.includes(`>${label}<`) || html.includes(`>${label} <`), `Missing nav label "${label}" in ${path.basename(filePath)}`);
    }
  }
});

test('main.js marks sedi pages as active in navigation', () => {
  const mainJs = fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8');
  assert(mainJs.includes('isSediSectionPage'), 'Expected sedi section detection helper');
  assert(mainJs.includes("link.classList.add('active')"), 'Expected active class handling for sedi nav');
});

test('embedded maps use tap-to-activate overlays on listing and contact pages', () => {
  for (const relativePath of ['contatti.html', 'sedi.html']) {
    const html = fs.readFileSync(path.join(root, relativePath), 'utf8');
    assert(html.includes('class="sede-map-overlay"'), `Missing map overlay in ${relativePath}`);
    assert(html.includes('Tocca per usare la mappa'), `Missing map overlay label in ${relativePath}`);
  }
});

test('copy-to-clipboard helper includes a fallback path', () => {
  const mainJs = fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8');
  assert(mainJs.includes('fallbackCopyToClipboard'), 'Expected clipboard fallback helper');
  assert(mainJs.includes("document.execCommand('copy')"), 'Expected execCommand fallback');
});

test('sede detail pages share premium layout assets and structure', () => {
  const sedeDetailCss = fs.readFileSync(path.join(root, 'css', 'sede-detail.css'), 'utf8');
  assert(
    sedeDetailCss.includes('body.page-sede-detail'),
    'Expected sede-detail.css scoped to body.page-sede-detail'
  );

  const sedePages = fs
    .readdirSync(path.join(root, 'sedi'))
    .filter((name) => name.endsWith('.html'))
    .map((name) => path.join(root, 'sedi', name));

  const requiredFragments = [
    'class="page-sede-detail"',
    'sede-detail.css?v=232',
    'sede-floating-bar',
    'sede-map-overlay',
    'sede-directions-grid',
    'section-sede-others',
  ];

  for (const filePath of sedePages) {
    const html = fs.readFileSync(filePath, 'utf8');
    for (const fragment of requiredFragments) {
      assert(
        html.includes(fragment),
        `Missing "${fragment}" in ${path.basename(filePath)}`
      );
    }
  }
});

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}

console.log(`\n${7} test(s) passed`);
