import { inject, injectable } from "tsyringe";
import type { Id, Name, Stocks } from "../domain/stock";
import { InjectionTokens } from "../injector";
import type { StockPort } from "../port/stockPort";
import { StockPresenter } from "../presenter/stockPresenter";

@injectable()
export class StockUsecase {
  constructor(
    @inject(InjectionTokens.StockPort) private readonly port: StockPort,
    private readonly presenter: StockPresenter
  ) {}

  async list(): Promise<void> {
    const stocks = await this.port.fetch();
    this.reflect(stocks);
  }

  edit(id: Id) {
    this.mutate((stocks) => stocks.edit(id));
  }

  update(id: Id, name: Name) {
    this.mutate((stocks) => stocks.update(id, name).finishEditing(id));
  }

  increase(id: Id) {
    this.mutate((stocks) => stocks.increase(id));
  }

  decrease(id: Id) {
    this.mutate((stocks) => stocks.decrease(id));
  }

  async save(): Promise<void> {
    const stocks = this.port.getAll();
    await this.port.save(stocks);
  }

  private mutate(mutation: (stocks: Stocks) => Stocks) {
    const stocks = this.port.getAll();
    const mutated = mutation(stocks);
    this.reflect(mutated);
  }

  private reflect(stocks: Stocks) {
    this.port.store(stocks);
    this.presenter.setStocks(stocks);
  }
}
