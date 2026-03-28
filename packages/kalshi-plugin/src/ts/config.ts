export type PluginEnvironment = "sandbox" | "production";

export type KalshiPluginConfig = {
  environment: PluginEnvironment;
  productionEnabled: boolean;
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
};

export function resolveBaseUrl(config: KalshiPluginConfig): string {
  if (config.baseUrl) return config.baseUrl;
  return config.environment === "production"
    ? "https://api.elections.kalshi.com/trade-api/v2"
    : "https://demo-api.kalshi.co/trade-api/v2";
}

export function normalizeConfig(raw: Partial<KalshiPluginConfig>): KalshiPluginConfig {
  const config: KalshiPluginConfig = {
    environment: raw.environment ?? "sandbox",
    productionEnabled: raw.productionEnabled ?? false,
    apiKey: raw.apiKey ?? "",
    apiSecret: raw.apiSecret ?? "",
    baseUrl: raw.baseUrl,
  };
  config.baseUrl = resolveBaseUrl(config);
  return config;
}
