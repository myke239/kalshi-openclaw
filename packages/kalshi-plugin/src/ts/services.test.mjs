import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeConfig } from './config.js';

test('normalizeConfig defaults to sandbox', () => {
  const config = normalizeConfig({});
  assert.equal(config.environment, 'sandbox');
  assert.equal(config.productionEnabled, false);
  assert.ok(config.baseUrl);
});
