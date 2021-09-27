import { singleton } from "tsyringe";
import type { Items, StockApi } from "./stockApi";

@singleton()
export class RemoteStockApi implements StockApi {
  getItems(): Promise<Items> {
    return RemoteStockApi.runScript<Items>("getStocks");
  }

  saveItems(items: Items): Promise<void> {
    return RemoteStockApi.runScript<void>("saveStocks", items);
  }

  private static runScript<T>(name: string, ...args: any): Promise<T> {
    return new Promise((resolve, reject) =>
      google.script.run
        .withSuccessHandler((result) => resolve(result))
        .withFailureHandler((error) => reject(error))
        [name](...args)
    );
  }
}
