import { singleton } from "tsyringe";
import type { Items, StockApi } from "./stockApi";

@singleton()
export class LocalStockApi implements StockApi {
  getItems(): Promise<Items> {
    return Promise.resolve({
      items: [
        {
          id: "id1",
          name: "item1",
          quantity: 1,
        },
        {
          id: "id2",
          name: "item2",
          quantity: 2,
        },
      ],
    });
  }

  saveItems(items: Items): Promise<void> {
    return Promise.resolve();
  }
}
