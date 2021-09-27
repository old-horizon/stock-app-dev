import { deepEqual, instance, mock, spy, verify, when } from "ts-mockito";
import { Spreadsheet } from "../spreadsheet";

describe("スプレッドシートを操作する", () => {
  let spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  let target: Spreadsheet;

  beforeEach(() => {
    spreadsheet = mock();
    target = new Spreadsheet(instance(spreadsheet));
  });

  test("指定されたシートを読み取る", () => {
    const targetSpy = spy(target);

    const expected = [];
    const sheet = mock<GoogleAppsScript.Spreadsheet.Sheet>();
    const range = mock<GoogleAppsScript.Spreadsheet.Range>();
    const values = [];
    const columns = new Map<number, string>();
    const records = [];

    when(spreadsheet.getSheetByName("sheet")).thenReturn(instance(sheet));
    when(targetSpy.getMaxRange(instance(sheet))).thenReturn(instance(range));
    when(range.getValues()).thenReturn(values);
    when(targetSpy.getColumns(values)).thenReturn(columns);
    when(targetSpy.getRecords(columns, values)).thenReturn(records);
    when(targetSpy.removeEmptyRecords(records)).thenReturn(expected);

    expect(target.read("sheet")).toEqual(expected);

    verify(spreadsheet.getSheetByName("sheet")).called();
    verify(targetSpy.getMaxRange(instance(sheet))).called();
    verify(range.getValues()).called();
    verify(targetSpy.getColumns(values)).called();
    verify(targetSpy.getRecords(columns, values)).called();
    verify(targetSpy.removeEmptyRecords(records)).called();
  });

  test("指定されたシートに書き込む", () => {
    const targetSpy = spy(target);

    const record = {
      column1: "value1",
      column2: "value2",
    };
    const records = [record];

    const header = ["column1", "column2", ""];
    const value = ["value1", "value2", ""];
    const emptyRow = ["", "", ""];
    const emptyRows = [emptyRow];
    const values = [header, value, emptyRow];

    const sheet = mock<GoogleAppsScript.Spreadsheet.Sheet>();
    const range = mock<GoogleAppsScript.Spreadsheet.Range>();

    when(spreadsheet.getSheetByName("sheet")).thenReturn(instance(sheet));
    when(targetSpy.getMaxRange(instance(sheet))).thenReturn(instance(range));
    when(range.getNumColumns()).thenReturn(3);
    when(range.getNumRows()).thenReturn(3);
    when(targetSpy.toHeaderRow(record, 3)).thenReturn(header);
    when(targetSpy.toRecordRow(record, 3)).thenReturn(value);
    when(targetSpy.emptyRows(1, 3)).thenReturn(emptyRows);

    target.write("sheet", records);

    verify(spreadsheet.getSheetByName("sheet")).called();
    verify(targetSpy.getMaxRange(instance(sheet))).called();
    verify(range.getNumColumns()).called();
    verify(range.getNumRows()).called();
    verify(targetSpy.toHeaderRow(record, 3)).called();
    verify(targetSpy.toRecordRow(record, 3)).called();
    verify(targetSpy.emptyRows(1, 3)).called();
    verify(range.setValues(deepEqual(values))).called();
  });

  test("シート全体の範囲を取得する", () => {
    const sheet = mock<GoogleAppsScript.Spreadsheet.Sheet>();
    const expected = {} as GoogleAppsScript.Spreadsheet.Range;

    when(sheet.getMaxRows()).thenReturn(10);
    when(sheet.getMaxColumns()).thenReturn(5);
    when(sheet.getRange(1, 1, 10, 5)).thenReturn(expected);

    expect(target.getMaxRange(instance(sheet))).toEqual(expected);

    verify(sheet.getMaxRows()).called();
    verify(sheet.getMaxColumns()).called();
    verify(sheet.getRange(1, 1, 10, 5)).called();
  });

  test("一行目からカラム情報を取得する", () => {
    const values = [
      ["column1", "column2"],
      ["value1", "value2"],
    ];

    const expected = new Map([
      [0, "column1"],
      [1, "column2"],
    ]);

    expect(target.getColumns(values)).toEqual(expected);
  });

  test("カラム情報と範囲の値からレコードのリストを返す", () => {
    const targetSpy = spy(target);

    const record = {
      column1: "value1",
      column2: "value2",
    };
    const expected = [record];
    const columns = new Map<number, string>();
    const header = ["column1", "column2"];
    const value = ["value1", "value2"];
    const values = [header, value];

    when(targetSpy.getRecord<any>(columns, value)).thenReturn(record);

    expect(target.getRecords(columns, values)).toEqual(expected);

    verify(targetSpy.getRecord<any>(columns, value)).called();
  });

  test("カラム情報と行の値からレコードを返す", () => {
    const expected = {
      column1: "value1",
      column2: "value2",
    };
    const columns = new Map<number, string>([
      [0, "column1"],
      [1, "column2"],
    ]);
    const value = ["value1", "value2"];

    expect(target.getRecord(columns, value)).toEqual(expected);
  });

  test("すべてのカラムの値が空文字のレコードを除外する", () => {
    const records = [
      {
        column1: "column1Value1",
        column2: "column2Value1",
      },
      {
        column1: "",
        column2: "column2Value2",
      },
      {
        column1: "column1Value3",
        column2: "",
      },
      {
        column1: "",
        column2: "",
      },
    ];

    const expected = [
      {
        column1: "column1Value1",
        column2: "column2Value1",
      },
      {
        column1: "",
        column2: "column2Value2",
      },
      {
        column1: "column1Value3",
        column2: "",
      },
    ];

    expect(target.removeEmptyRecords(records)).toEqual(expected);
  });

  test("レコードをヘッダー行に変換する", () => {
    const record = {
      column1: "value1",
      column2: "value2",
    };

    const expected = ["column1", "column2", ""];

    expect(target.toHeaderRow(record, 3)).toEqual(expected);
  });

  test("レコードを値の行に変換する", () => {
    const record = {
      column1: "value1",
      column2: "value2",
    };

    const expected = ["value1", "value2", ""];

    expect(target.toRecordRow(record, 3)).toEqual(expected);
  });

  test("指定された行数分、全列が空白の行を返す", () => {
    const expected = [["", "", ""]];
    expect(target.emptyRows(1, 3)).toEqual(expected);
  });
});
