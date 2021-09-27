import { singleton } from "tsyringe";

@singleton()
export class StockStorage {
  private items: Item[];

  store(items: Item[]): void {
    this.items = items;
  }

  getAll(): Item[] {
    return [...this.items];
  }
}

export type Item = {
  id: string;
  name: string;
  quantity: number;
  editing: boolean;
};
