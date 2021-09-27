import { container } from "tsyringe";
import type { constructor } from "tsyringe/dist/typings/types";

export const InjectionTokens = {
  StockPort: "StockPort",
  StockApi: "StockApi",
} as const;

export type InjectionToken = keyof typeof InjectionTokens;

type InjectionConfig = {
  prod: constructor<any>;
  dev: constructor<any>;
};

export const provide = (
  token: InjectionToken,
  config: constructor<any> | InjectionConfig
) => {
  config instanceof Function
    ? container.register(token, { useClass: config })
    : process.env.NODE_ENV === "production"
    ? container.register(token, { useClass: config.prod })
    : container.register(token, { useClass: config.dev });
};
