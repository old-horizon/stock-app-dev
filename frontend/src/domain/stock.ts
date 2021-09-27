import { FCC } from "./fcc";

export class Id {
  constructor(readonly value: string) {}
}

export class Name {
  constructor(readonly value: string) {}
}

export class Quantity {
  constructor(readonly value: number) {}

  increase(): Quantity {
    return new Quantity(this.value + 1);
  }

  decrease(): Quantity {
    return this.value > 0 ? new Quantity(this.value - 1) : this;
  }
}

export class Stock {
  constructor(
    readonly id: Id,
    readonly name: Name,
    readonly quantity: Quantity,
    readonly editing: boolean
  ) {}
}

export class Stocks extends FCC<Stock> {
  edit(id: Id): Stocks {
    return new Stocks(
      this.map((s) =>
        s.id.value === id.value ? new Stock(s.id, s.name, s.quantity, true) : s
      )
    );
  }

  update(id: Id, name: Name): Stocks {
    return new Stocks(
      this.map((s) =>
        s.id.value === id.value
          ? new Stock(s.id, name, s.quantity, s.editing)
          : s
      )
    );
  }

  finishEditing(id: Id): Stocks {
    return new Stocks(
      this.map((s) =>
        s.id.value === id.value ? new Stock(s.id, s.name, s.quantity, false) : s
      )
    );
  }

  increase(id: Id): Stocks {
    return new Stocks(
      this.map((s) =>
        s.id.value === id.value
          ? new Stock(s.id, s.name, s.quantity.increase(), s.editing)
          : s
      )
    );
  }

  decrease(id: Id): Stocks {
    return new Stocks(
      this.map((s) =>
        s.id.value === id.value
          ? new Stock(s.id, s.name, s.quantity.decrease(), s.editing)
          : s
      )
    );
  }
}
