import { instance, mock, verify, when } from "ts-mockito";
import { Id, Name, Stocks } from "../../domain/stock";
import type { StockPort } from "../../port/stockPort";
import type { StockPresenter } from "../../presenter/stockPresenter";
import { StockUsecase } from "../stockUsecase";

describe("在庫情報を管理する", () => {
  let port: StockPort;
  let presenter: StockPresenter;
  let target: StockUsecase;

  beforeEach(() => {
    port = mock<StockPort>();
    presenter = mock<StockPresenter>();
    target = new StockUsecase(instance(port), instance(presenter));
  });

  test("すべての在庫を取得して表示する", async () => {
    const stocks = mock(Stocks);

    when(port.fetch()).thenResolve(stocks);

    await target.list();

    verify(port.fetch()).called();
    verify(port.store(stocks)).called();
    verify(presenter.setStocks(stocks)).called();
  });

  test("指定した在庫を編集する", () => {
    const id = mock(Id);
    const stocks = mock(Stocks);
    const edited = mock(Stocks);

    when(port.getAll()).thenReturn(instance(stocks));
    when(stocks.edit(id)).thenReturn(instance(edited));

    target.edit(id);

    verify(port.getAll()).called();
    verify(stocks.edit(id)).called();
    verify(port.store(instance(edited)));
    verify(presenter.setStocks(instance(edited)));
  });

  test("指定した在庫の名前を更新する", () => {
    const id = mock(Id);
    const name = mock(Name);
    const stocks = mock(Stocks);
    const updated = mock(Stocks);
    const finished = mock(Stocks);

    when(port.getAll()).thenReturn(instance(stocks));
    when(stocks.update(id, name)).thenReturn(instance(updated));
    when(stocks.finishEditing(id)).thenReturn(instance(finished));

    target.update(id, name);

    verify(port.getAll()).called();
    verify(stocks.update(id, name)).called();
    verify(updated.finishEditing(id)).called();
    verify(port.store(instance(finished)));
    verify(presenter.setStocks(instance(finished)));
  });

  test("指定した在庫の個数を増やす", () => {
    const id = mock(Id);
    const stocks = mock(Stocks);
    const increased = mock(Stocks);

    when(port.getAll()).thenReturn(instance(stocks));
    when(stocks.increase(id)).thenReturn(instance(increased));

    target.increase(id);

    verify(port.getAll()).called();
    verify(stocks.increase(id)).called();
    verify(port.store(instance(increased)));
    verify(presenter.setStocks(instance(increased))).called();
  });

  test("指定した在庫の個数を減らす", () => {
    const id = mock(Id);
    const stocks = mock(Stocks);
    const decreased = mock(Stocks);

    when(port.getAll()).thenReturn(instance(stocks));
    when(stocks.decrease(id)).thenReturn(instance(decreased));

    target.decrease(id);

    verify(port.getAll()).called();
    verify(stocks.decrease(id)).called();
    verify(port.store(decreased));
    verify(presenter.setStocks(instance(decreased))).called();
  });

  test("すべての在庫を保存する", async () => {
    const stocks = mock(Stocks);

    when(port.getAll()).thenReturn(instance(stocks));

    await target.save();

    verify(port.getAll()).called();
    verify(port.save(instance(stocks))).called();
  });
});
