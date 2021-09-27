import { singleton } from "tsyringe";
import { writable, Writable } from "svelte/store";

@singleton()
export class StockState {
  stocks: Writable<StockUnit[]> = writable([]);
}

export type StockUnit = {
  id: string;
  name: string;
  quantity: number;
  editing: boolean;
};
