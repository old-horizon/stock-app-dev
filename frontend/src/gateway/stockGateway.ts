import { inject, injectable } from "tsyringe";
import { Id, Name, Quantity, Stock, Stocks } from "../domain/stock";
import type { Item as ApiItem, StockApi } from "../driver/stockApi";
import { Item as StorageItem, StockStorage } from "../driver/stockStorage";
import { InjectionTokens } from "../injector";
import type { StockPort } from "../port/stockPort";

@injectable()
export class StockGateway implements StockPort {
  constructor(
    @inject(InjectionTokens.StockApi) private readonly api: StockApi,
    private readonly storage: StockStorage
  ) {}

  async fetch(): Promise<Stocks> {
    const { items } = await this.api.getItems();
    return new Stocks(items.map((i) => this.toStock(i)));
  }

  store(stocks: Stocks): void {
    const items = stocks.map((s) => this.toStorageItem(s));
    this.storage.store(items);
  }

  getAll(): Stocks {
    const items = this.storage.getAll();
    return new Stocks(items.map((i) => this.toStock(i)));
  }

  async save(stocks: Stocks): Promise<void> {
    const items = stocks.map((s) => this.toApiItem(s));
    await this.api.saveItems({ items });
  }

  toStock(item: ApiItem | StorageItem): Stock {
    return "editing" in item
      ? new Stock(
          new Id(item.id),
          new Name(item.name),
          new Quantity(item.quantity),
          item.editing
        )
      : new Stock(
          new Id(item.id),
          new Name(item.name),
          new Quantity(item.quantity),
          false
        );
  }

  toStorageItem(stock: Stock): StorageItem {
    return {
      id: stock.id.value,
      name: stock.name.value,
      quantity: stock.quantity.value,
      editing: stock.editing,
    };
  }

  toApiItem(stock: Stock): ApiItem {
    return {
      id: stock.id.value,
      name: stock.name.value,
      quantity: stock.quantity.value,
    };
  }
}
