import fs from 'node:fs';
import path from 'node:path';
import { createKalshiServices } from './services.js';

const configPath = path.resolve(process.cwd(), 'local.sandbox.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const services = createKalshiServices({ config });

const balance = await services.account.getAccount();
console.log('BALANCE');
console.log(JSON.stringify(balance, null, 2));

const markets = await services.markets.searchMarkets({ status: 'open', limit: 3 });
console.log('MARKETS');
console.log(JSON.stringify(markets, null, 2));

const firstTicker = (markets as any)?.markets?.[0]?.ticker;
if (firstTicker) {
  const orderbook = await services.markets.getOrderbook(firstTicker, 5);
  console.log('ORDERBOOK');
  console.log(JSON.stringify(orderbook, null, 2));
}
