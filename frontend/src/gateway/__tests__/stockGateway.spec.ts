import { deepEqual, instance, mock, spy, verify, when } from "ts-mockito";
import { Id, Name, Quantity, Stock, Stocks } from "../../domain/stock";
import type { Item as ApiItem, StockApi } from "../../driver/stockApi";
import type {
  Item as StorageItem,
  StockStorage,
} from "../../driver/stockStorage";
import { StockGateway } from "../stockGateway";

describe("在庫情報を取得する", () => {
  let api: StockApi;
  let storage: StockStorage;
  let target: StockGateway;

  beforeEach(() => {
    api = mock<StockApi>();
    storage = mock<StockStorage>();
    target = new StockGateway(instance(api), instance(storage));
  });

  test("すべての在庫を取得する", async () => {
    const targetSpy = spy(target);

    const item1 = instance(mock<ApiItem>());
    const item2 = instance(mock<ApiItem>());
    const items = { items: [item1, item2] };

    const stock1 = instance(mock(Stock));
    const stock2 = instance(mock(Stock));
    const expected = new Stocks([stock1, stock2]);

    when(api.getItems()).thenResolve(items);
    when(targetSpy.toStock(item1)).thenReturn(stock1);
    when(targetSpy.toStock(item2)).thenReturn(stock2);

    expect(await target.fetch()).toEqual(expected);

    verify(api.getItems()).called();
    verify(targetSpy.toStock(item1)).called();
    verify(targetSpy.toStock(item2)).called();
  });

  test("在庫情報を保存する", () => {
    const targetSpy = spy(target);

    const stock1 = instance(mock(Stock));
    const stock2 = instance(mock(Stock));
    const stocks = new Stocks([stock1, stock2]);

    const item1 = instance(mock<StorageItem>());
    const item2 = instance(mock<StorageItem>());
    const items = [item1, item2];

    when(targetSpy.toStorageItem(stock1)).thenReturn(item1);
    when(targetSpy.toStorageItem(stock2)).thenReturn(item2);

    target.store(stocks);

    verify(targetSpy.toStorageItem(stock1)).called();
    verify(targetSpy.toStorageItem(stock2)).called();
    verify(storage.store(deepEqual(items))).called();
  });

  test("保存された在庫情報を返す", () => {
    const targetSpy = spy(target);

    const item1 = instance(mock<StorageItem>());
    const item2 = instance(mock<StorageItem>());
    const items = [item1, item2];

    const stock1 = instance(mock(Stock));
    const stock2 = instance(mock(Stock));
    const expected = new Stocks([stock1, stock2]);

    when(storage.getAll()).thenReturn(items);
    when(targetSpy.toStock(item1)).thenReturn(stock1);
    when(targetSpy.toStock(item2)).thenReturn(stock2);

    expect(target.getAll()).toEqual(expected);

    verify(storage.getAll()).called();
    verify(targetSpy.toStock(item1)).called();
    verify(targetSpy.toStock(item2)).called();
  });

  test("すべての在庫を保存する", async () => {
    const targetSpy = spy(target);

    const stock1 = instance(mock(Stock));
    const stock2 = instance(mock(Stock));
    const stocks = new Stocks([stock1, stock2]);

    const item1 = instance(mock<ApiItem>());
    const item2 = instance(mock<ApiItem>());
    const items = { items: [item1, item2] };

    when(targetSpy.toApiItem(stock1)).thenReturn(item1);
    when(targetSpy.toApiItem(stock2)).thenReturn(item2);

    target.save(stocks);

    verify(targetSpy.toApiItem(stock1)).called();
    verify(targetSpy.toApiItem(stock2)).called();
    verify(api.saveItems(deepEqual(items))).called();
  });

  test("ApiのItemをStockに変換する", () => {
    const item = {
      id: "id",
      name: "item",
      quantity: 10,
    };

    const expected = new Stock(
      new Id("id"),
      new Name("item"),
      new Quantity(10),
      false
    );

    expect(target.toStock(item)).toEqual(expected);
  });

  test("StorageのItemをStockに変換する", () => {
    const item = {
      id: "id",
      name: "item",
      quantity: 10,
      editing: true,
    };

    const expected = new Stock(
      new Id("id"),
      new Name("item"),
      new Quantity(10),
      true
    );

    expect(target.toStock(item)).toEqual(expected);
  });

  test("StockをStorageのItemに変換する", () => {
    const stock = new Stock(
      new Id("id"),
      new Name("item"),
      new Quantity(10),
      true
    );

    const expected = {
      id: "id",
      name: "item",
      quantity: 10,
      editing: true,
    };

    expect(target.toStorageItem(stock)).toEqual(expected);
  });

  test("StockをApiのItemに変換する", () => {
    const stock = new Stock(
      new Id("id"),
      new Name("item"),
      new Quantity(10),
      true
    );

    const expected = {
      id: "id",
      name: "item",
      quantity: 10,
    };

    expect(target.toApiItem(stock)).toEqual(expected);
  });
});
