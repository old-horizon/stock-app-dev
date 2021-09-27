import type { Stocks } from "../domain/stock";

export interface StockPort {
  fetch(): Promise<Stocks>;
  store(stocks: Stocks): void;
  getAll(): Stocks;
  save(stocks: Stocks): Promise<void>;
}
