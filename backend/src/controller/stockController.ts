import { Id, Name, Quantity, Stock, Stocks } from "../domain/stock";
import { StockUsecase } from "../usecase/stockUsecase";

export class StockController {
  constructor(private readonly usecase: StockUsecase) {}

  get(): Items {
    const stocks = this.usecase.findAll();
    return { items: stocks.map((s) => this.toItem(s)) };
  }

  save(items: Items) {
    const stocks = new Stocks(items.items.map((i) => this.toStock(i)));
    this.usecase.saveAll(stocks);
  }

  toItem(stock: Stock): Item {
    return {
      id: stock.id.value,
      name: stock.name.value,
      quantity: stock.quantity.value,
    };
  }

  toStock(item: Item): Stock {
    return new Stock(
      new Id(item.id),
      new Name(item.name),
      new Quantity(item.quantity)
    );
  }
}

export type Item = {
  id: string;
  name: string;
  quantity: number;
};

export type Items = {
  items: Item[];
};
