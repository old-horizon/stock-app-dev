import { FCC } from "./fcc";

export class Id {
  constructor(readonly value: string) {}
}

export class Name {
  constructor(readonly value: string) {}
}

export class Quantity {
  constructor(readonly value: number) {}
}

export class Stock {
  constructor(
    readonly id: Id,
    readonly name: Name,
    readonly quantity: Quantity
  ) {}
}

export class Stocks extends FCC<Stock> {}
