import test from 'node:test';
import assert from 'node:assert/strict';

import { createKalshiServices } from './services.js';

test('services expose local risk controls without credentials', async () => {
  const services = createKalshiServices({ config: { environment: 'sandbox', productionEnabled: false } });
  const armed = services.controls.armMarket({ ticker: 'TEST-MARKET' });
  assert.equal(armed.ok, true);
  const risk = services.controls.getRiskStatus();
  assert.equal(Array.isArray(risk.armedMarkets), true);
});
