import { Stocks, Stock, Name, Quantity, Id } from "../domain/stock";
import { Spreadsheet } from "../driver/spreadsheet";
import { StockPort } from "../port/stockPort";

export class StockGateway implements StockPort {
  constructor(private readonly spreadsheet: Spreadsheet) {}

  findAll(): Stocks {
    const items = this.spreadsheet.read<Item>("stocks");
    return new Stocks(items.map((i) => this.toStock(i)));
  }

  saveAll(stocks: Stocks): void {
    const items = stocks.map((s) => this.toItem(s));
    this.spreadsheet.write("stocks", items);
  }

  toStock(item: Item): Stock {
    return new Stock(
      new Id(item.id),
      new Name(item.name),
      new Quantity(item.quantity)
    );
  }

  toItem(stock: Stock): Item {
    return {
      id: stock.id.value,
      name: stock.name.value,
      quantity: stock.quantity.value,
    };
  }
}

export type Item = {
  id: string;
  name: string;
  quantity: number;
};
