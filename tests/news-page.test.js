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

console.log(`\n${5} test(s) passed`);
