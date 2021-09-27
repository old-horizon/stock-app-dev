export class Spreadsheet {
  constructor(
    private readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
  ) {}

  read<T>(sheetName: string): T[] {
    const sheet = this.spreadsheet.getSheetByName(sheetName);
    const values = this.getMaxRange(sheet).getValues();
    const columns = this.getColumns(values);
    return this.removeEmptyRecords(this.getRecords(columns, values));
  }

  write<T>(sheetName: string, records: T[]): void {
    const sheet = this.spreadsheet.getSheetByName(sheetName);
    const range = this.getMaxRange(sheet);
    const numColumns = range.getNumColumns();
    const header = this.toHeaderRow(records[0], numColumns);
    const rows = records.map((r) => this.toRecordRow(r, numColumns));
    const emptyRows = this.emptyRows(
      range.getNumRows() - records.length - 1,
      numColumns
    );
    range.setValues([header, ...rows, ...emptyRows]);
  }

  getMaxRange(
    sheet: GoogleAppsScript.Spreadsheet.Sheet
  ): GoogleAppsScript.Spreadsheet.Range {
    return sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
  }

  getColumns(values: any[][]): Map<number, string> {
    const columns = new Map<number, string>();
    values[0].forEach((column, index) => columns.set(index, column));
    return columns;
  }

  getRecords<T>(columns: Map<number, string>, values: any[][]): T[] {
    return values.slice(1).map((value) => this.getRecord(columns, value));
  }

  getRecord<T>(columns: Map<number, string>, value: any[]): T {
    const record = {};
    for (const [index, column] of columns.entries()) {
      record[column] = value[index];
    }
    return record as T;
  }

  removeEmptyRecords<T>(records: T[]): T[] {
    return records.filter(
      (record) =>
        Object.entries(record).filter(([_, value]) => value !== "").length > 0
    );
  }

  toHeaderRow(record: any, numColumns: number): any[] {
    const keys = Object.keys(record);
    const emptyColumns = Spreadsheet.filledArray(numColumns - keys.length, "");
    return [...keys, ...emptyColumns];
  }

  toRecordRow(record: any, numColumns: number): any[] {
    const values = Object.values(record);
    const emptyColumns = Spreadsheet.filledArray(
      numColumns - values.length,
      ""
    );
    return [...values, ...emptyColumns];
  }

  emptyRows(length: number, numColumns: number): any[] {
    const emptyRow = Spreadsheet.filledArray(numColumns, "");
    return Spreadsheet.filledArray(length, emptyRow);
  }

  private static filledArray(length: number, element: any) {
    return new Array(length).fill(element);
  }
}
