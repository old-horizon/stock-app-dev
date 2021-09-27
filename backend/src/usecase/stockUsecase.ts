import { Stocks } from "../domain/stock";
import { StockPort } from "../port/stockPort";

export class StockUsecase {
  constructor(private readonly port: StockPort) {}

  findAll(): Stocks {
    return this.port.findAll();
  }

  saveAll(stocks: Stocks): void {
    this.port.saveAll(stocks);
  }
}
