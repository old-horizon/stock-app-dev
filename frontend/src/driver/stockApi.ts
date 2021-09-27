export interface StockApi {
  getItems(): Promise<Items>;
  saveItems(items: Items): Promise<void>;
}

export type Item = {
  id: string;
  name: string;
  quantity: number;
};

export type Items = {
  items: Item[];
};
