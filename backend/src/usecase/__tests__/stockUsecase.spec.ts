import { instance, mock, verify, when } from "ts-mockito";
import { Stocks } from "../../domain/stock";
import { StockPort } from "../../port/stockPort";
import { StockUsecase } from "../stockUsecase";

describe("在庫情報を管理する", () => {
  let port: StockPort;
  let target: StockUsecase;

  beforeEach(() => {
    port = mock();
    target = new StockUsecase(instance(port));
  });

  test("すべての在庫を取得して返す", () => {
    const stocks = mock(Stocks);

    when(port.findAll()).thenReturn(instance(stocks));

    expect(target.findAll()).toEqual(instance(stocks));

    verify(port.findAll()).called();
  });

  test("すべての在庫を保存する", () => {
    const stocks = instance(mock(Stocks));

    target.saveAll(stocks);

    verify(port.saveAll(stocks)).called();
  });
});
