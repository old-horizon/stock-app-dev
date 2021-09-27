export abstract class FCC<T> {
  constructor(readonly array: Array<T>) {}

  [Symbol.iterator](): IterableIterator<T> {
    return this.array[Symbol.iterator]();
  }

  get length(): number {
    return this.array.length;
  }

  concat(...items: (T | ConcatArray<T>)[]): T[] {
    return this.array.concat();
  }

  sort(compareFn?: (a: T, b: T) => number): T[] {
    return this.array.sort(compareFn);
  }

  every<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S,
    thisArg?: any
  ): this is S[] {
    return this.array.every(predicate);
  }

  some(
    predicate: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): boolean {
    return this.array.some(predicate);
  }

  forEach(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: any
  ): void {
    this.array.forEach(callbackfn);
  }

  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[] {
    return this.array.map(callbackfn);
  }

  filter<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S,
    thisArg?: any
  ): S[] {
    return this.array.filter(predicate);
  }

  find<S extends T>(
    predicate: (this: void, value: T, index: number, obj: T[]) => value is S,
    thisArg?: any
  ): S {
    return this.array.find(predicate);
  }

  includes(searchElement: T, fromIndex?: number): boolean {
    return this.array.includes(searchElement, fromIndex);
  }

  flatMap<U, This = undefined>(
    callback: (
      this: This,
      value: T,
      index: number,
      array: T[]
    ) => U | readonly U[],
    thisArg?: This
  ): U[] {
    return this.array.flatMap(callback);
  }
}
