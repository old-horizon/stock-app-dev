import { get } from "svelte/store";
import { Id, Name, Quantity, Stock, Stocks } from "../../domain/stock";
import { StockState } from "../../views/state/stockState";
import { StockPresenter } from "../stockPresenter";

describe("在庫情報を表示する", () => {
  let state: StockState;
  let target: StockPresenter;

  beforeEach(() => {
    state = new StockState();
    target = new StockPresenter(state);
  });

  test("すべての在庫を表示する", () => {
    const stocks = new Stocks([
      new Stock(new Id("id1"), new Name("item1"), new Quantity(1), true),
      new Stock(new Id("id2"), new Name("item2"), new Quantity(2), false),
    ]);

    const expected = [
      {
        id: "id1",
        name: "item1",
        quantity: 1,
        editing: true,
      },
      {
        id: "id2",
        name: "item2",
        quantity: 2,
        editing: false,
      },
    ];

    target.setStocks(stocks);

    expect(get(state.stocks)).toEqual(expected);
  });
});
