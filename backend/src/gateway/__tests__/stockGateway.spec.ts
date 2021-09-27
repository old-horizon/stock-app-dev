import { deepEqual, instance, mock, spy, verify, when } from "ts-mockito";
import { Stock, Stocks, Name, Quantity, Id } from "../../domain/stock";
import { Spreadsheet } from "../../driver/spreadsheet";
import { Item, StockGateway } from "../stockGateway";

describe("在庫情報を取得する", () => {
  let spreadsheet: Spreadsheet;
  let target: StockGateway;

  beforeEach(() => {
    spreadsheet = mock();
    target = new StockGateway(instance(spreadsheet));
  });

  test("すべての在庫を取得する", () => {
    const targetSpy = spy(target);

    const item1 = instance(mock<Item>());
    const item2 = instance(mock<Item>());
    const items = [item1, item2];

    const stock1 = instance(mock(Stock));
    const stock2 = instance(mock(Stock));
    const expected = new Stocks([stock1, stock2]);

    when(spreadsheet.read("stocks")).thenReturn(items);
    when(targetSpy.toStock(item1)).thenReturn(stock1);
    when(targetSpy.toStock(item2)).thenReturn(stock2);

    expect(target.findAll()).toEqual(expected);

    verify(spreadsheet.read("stocks")).called();
    verify(targetSpy.toStock(item1)).called();
    verify(targetSpy.toStock(item2)).called();
  });

  test("すべての在庫を保存する", () => {
    const targetSpy = spy(target);

    const stock1 = instance(mock(Stock));
    const stock2 = instance(mock(Stock));
    const stocks = new Stocks([stock1, stock2]);

    const item1 = instance(mock<Item>());
    const item2 = instance(mock<Item>());
    const items = [item1, item2];

    when(targetSpy.toItem(stock1)).thenReturn(item1);
    when(targetSpy.toItem(stock2)).thenReturn(item1);

    target.saveAll(stocks);

    verify(targetSpy.toItem(stock1)).called();
    verify(targetSpy.toItem(stock2)).called();
    verify(spreadsheet.write("stocks", deepEqual(items))).called();
  });

  test("ItemをStockに変換する", () => {
    const item = {
      id: "id",
      name: "item",
      quantity: 10,
    };

    const expected = new Stock(
      new Id("id"),
      new Name("item"),
      new Quantity(10)
    );

    expect(target.toStock(item)).toEqual(expected);
  });

  test("StockをItemに変換する", () => {
    const stock = new Stock(new Id("id"), new Name("item"), new Quantity(10));

    const expected = {
      id: "id",
      name: "item",
      quantity: 10,
    };

    expect(target.toItem(stock)).toEqual(expected);
  });
});
