import "@abraham/reflection";
import App from "./App.svelte";
import { LocalStockApi } from "./driver/localStockApi";
import { RemoteStockApi } from "./driver/remoteStockApi";
import { StockGateway } from "./gateway/stockGateway";
import { InjectionTokens, provide } from "./injector";

provide(InjectionTokens.StockApi, {
  prod: RemoteStockApi,
  dev: LocalStockApi,
});
provide(InjectionTokens.StockPort, StockGateway);

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
