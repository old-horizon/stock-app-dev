import { instance, mock, verify, when } from "ts-mockito";
import { Id, Name, Quantity, Stock, Stocks } from "../stock";

describe("在庫情報を操作する", () => {
  test("指定した在庫を編集する", () => {
    const target = new Stocks([
      new Stock(new Id("id1"), new Name("name1"), new Quantity(10), false),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    const expected = new Stocks([
      new Stock(new Id("id1"), new Name("name1"), new Quantity(10), true),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    expect(target.edit(new Id("id1"))).toEqual(expected);
  });

  test("指定した在庫の名前を更新する", () => {
    const target = new Stocks([
      new Stock(new Id("id1"), new Name("name1"), new Quantity(10), false),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    const expected = new Stocks([
      new Stock(new Id("id1"), new Name("newName1"), new Quantity(10), false),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    expect(target.update(new Id("id1"), new Name("newName1"))).toEqual(
      expected
    );
  });

  test("指定した在庫の編集を終える", () => {
    const target = new Stocks([
      new Stock(new Id("id1"), new Name("name1"), new Quantity(10), true),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    const expected = new Stocks([
      new Stock(new Id("id1"), new Name("name1"), new Quantity(10), false),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    expect(target.finishEditing(new Id("id1"))).toEqual(expected);
  });

  test("指定した在庫の個数を増やす", () => {
    const quantity = mock(Quantity);
    const increased = mock(Quantity);

    const target = new Stocks([
      new Stock(new Id("id1"), new Name("name1"), instance(quantity), false),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    const expected = new Stocks([
      new Stock(new Id("id1"), new Name("name1"), instance(increased), false),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    when(quantity.increase()).thenReturn(instance(increased));

    expect(target.increase(new Id("id1"))).toEqual(expected);

    verify(quantity.increase()).called();
  });

  test("指定した在庫の個数を減らす", () => {
    const quantity = mock(Quantity);
    const decreased = mock(Quantity);

    const target = new Stocks([
      new Stock(new Id("id1"), new Name("name1"), instance(quantity), false),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    const expected = new Stocks([
      new Stock(new Id("id1"), new Name("name1"), instance(decreased), false),
      new Stock(new Id("id2"), new Name("name2"), new Quantity(20), false),
    ]);

    when(quantity.decrease()).thenReturn(instance(decreased));

    expect(target.decrease(new Id("id1"))).toEqual(expected);

    verify(quantity.decrease()).called();
  });
});

describe("個数を操作する", () => {
  test("個数を増やす", () => {
    const target = new Quantity(1);
    const expected = new Quantity(2);

    expect(target.increase()).toEqual(expected);
  });

  test("1個以上の場合は個数を減らす", () => {
    const target = new Quantity(1);
    const expected = new Quantity(0);

    expect(target.decrease()).toEqual(expected);
  });

  test("0個の場合は個数を減らさない", () => {
    const target = new Quantity(0);
    const expected = new Quantity(0);

    expect(target.decrease()).toEqual(expected);
  });
});
