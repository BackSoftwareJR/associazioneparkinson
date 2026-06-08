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

const newsHtml = fs.readFileSync(path.join(root, 'news.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');

test('news.html uses the bulletin board page class', () => {
  assert(newsHtml.includes('class="page-news"'), 'Expected body.page-news');
});

test('news.html includes masthead and board structure', () => {
  const requiredFragments = [
    'news-masthead',
    'news-board-section',
    'news-board-layout',
    'news-card--featured',
    'news-sidebar',
    'news-archive-list',
  ];

  for (const fragment of requiredFragments) {
    assert(newsHtml.includes(fragment), `Missing markup fragment: ${fragment}`);
  }
});

test('news.html keeps the featured article accessible', () => {
  assert(
    newsHtml.includes('id="approvazione-bilancio-2025"'),
    'Featured article anchor id is missing'
  );
  assert(
    newsHtml.includes('href="#approvazione-bilancio-2025"'),
    'Archive link to featured article is missing'
  );
  assert(
    newsHtml.includes('<details class="news-details">'),
    'Expandable article details are missing'
  );
});

test('news.html shows the assembly date as 23 May 2026', () => {
  const assemblyDateMarkers = [
    'Ultimo: 23 Maggio 2026',
    'datetime="2026-05-23"',
  ];

  for (const marker of assemblyDateMarkers) {
    assert(newsHtml.includes(marker), `Missing assembly date marker: ${marker}`);
  }

  assert(
    newsHtml.includes('Assemblea ordinaria · Maggio 2026'),
    'Media caption should reference May 2026'
  );
  assert(
    newsHtml.includes('<span class="news-date-year">2026</span>'),
    'Featured article year badge should be 2026'
  );
  assert(
    newsHtml.includes('Il 23 maggio 2026 si è svolta l\'assemblea ordinaria'),
    'Article copy should mention 23 May 2026'
  );
  assert(
    !newsHtml.includes('datetime="2025-05-23"'),
    'Assembly date should not use 2025'
  );
  assert(
    !newsHtml.includes('Maggio 2025'),
    'Assembly month caption should not use 2025'
  );
});

test('style.css defines bulletin board styles', () => {
  const requiredSelectors = [
    '.news-masthead',
    '.news-board-section',
    '.news-card',
    '.news-card-pin',
    '.news-sidebar',
    '.news-read-toggle',
  ];

  for (const selector of requiredSelectors) {
    assert(styleCss.includes(selector), `Missing CSS selector: ${selector}`);
  }
});

test('style.css no longer relies on the old flat news list layout', () => {
  assert(!styleCss.includes('.news-list {'), 'Old .news-list styles should be removed');
  assert(!styleCss.includes('.news-article {'), 'Old .news-article styles should be removed');
});

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}

console.log(`\n${6} test(s) passed`);
