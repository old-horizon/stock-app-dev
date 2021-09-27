import { Items, StockController } from "./controller/stockController";
import { Spreadsheet } from "./driver/spreadsheet";
import { StockGateway } from "./gateway/stockGateway";
import { StockUsecase } from "./usecase/stockUsecase";

const doGet = () => HtmlService.createTemplateFromFile("build/page").evaluate();
const include = (filename: string) =>
  HtmlService.createHtmlOutputFromFile(filename).getContent();

const controller = new StockController(
  new StockUsecase(
    new StockGateway(new Spreadsheet(SpreadsheetApp.getActiveSpreadsheet()))
  )
);

const getStocks = () => controller.get();
const saveStocks = (items: Items) => controller.save(items);
