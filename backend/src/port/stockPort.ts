import { Stocks } from "../domain/stock";

export interface StockPort {
  findAll(): Stocks;
  saveAll(stocks: Stocks): void;
}
