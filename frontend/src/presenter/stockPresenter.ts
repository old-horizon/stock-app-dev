import { injectable } from "tsyringe";
import type { Stocks } from "../domain/stock";
import { StockState } from "../views/state/stockState";

@injectable()
export class StockPresenter {
  constructor(private readonly state: StockState) {}

  setStocks(stocks: Stocks): void {
    this.state.stocks.set(
      stocks.map((s) => ({
        id: s.id.value,
        name: s.name.value,
        quantity: s.quantity.value,
        editing: s.editing,
      }))
    );
  }
}
