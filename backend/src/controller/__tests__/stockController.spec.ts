import { deepEqual, instance, mock, spy, verify, when } from "ts-mockito";
import { Stock, Stocks, Name, Quantity, Id } from "../../domain/stock";
import { StockUsecase } from "../../usecase/stockUsecase";
import { StockController } from "../stockController";

describe("在庫情報に関する要求を処理する", () => {
  let usecase: StockUsecase;
  let target: StockController;

  beforeEach(() => {
    usecase = mock();
    target = new StockController(instance(usecase));
  });

  test("すべての在庫を変換して返す", () => {
    const targetSpy = spy(target);

    const stock1 = instance(mock(Stock));
    const stock2 = instance(mock(Stock));
    const stocks = new Stocks([stock1, stock2]);

    const item1 = { id: "id1", name: "item1", quantity: 1 };
    const item2 = { id: "id2", name: "item2", quantity: 2 };
    const expected = { items: [item1, item2] };

    when(usecase.findAll()).thenReturn(stocks);
    when(targetSpy.toItem(stock1)).thenReturn(item1);
    when(targetSpy.toItem(stock2)).thenReturn(item2);

    expect(target.get()).toEqual(expected);

    verify(usecase.findAll()).called();
    verify(targetSpy.toItem(stock1)).called();
    verify(targetSpy.toItem(stock2)).called();
  });

  test("すべての在庫を保存する", () => {
    const targetSpy = spy(target);

    const item1 = { id: "id1", name: "item1", quantity: 1 };
    const item2 = { id: "id2", name: "item2", quantity: 2 };
    const items = { items: [item1, item2] };

    const stock1 = instance(mock(Stock));
    const stock2 = instance(mock(Stock));
    const stocks = new Stocks([stock1, stock2]);

    when(targetSpy.toStock(item1)).thenReturn(stock1);
    when(targetSpy.toStock(item2)).thenReturn(stock2);

    target.save(items);

    verify(targetSpy.toStock(item1)).called();
    verify(targetSpy.toStock(item2)).called();
    verify(usecase.saveAll(deepEqual(stocks)));
  });

  test("StockをItemに変換する", () => {
    const stock = new Stock(new Id("id"), new Name("item"), new Quantity(1));
    const expected = { id: "id", name: "item", quantity: 1 };

    expect(target.toItem(stock)).toEqual(expected);
  });

  test("ItemをStockに変換する", () => {
    const item = { id: "id", name: "item", quantity: 1 };
    const expected = new Stock(new Id("id"), new Name("item"), new Quantity(1));

    expect(target.toStock(item)).toEqual(expected);
  });
});
