/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Context } from "react";

import { Config as CommonConfig } from "@common";

export default class Config extends CommonConfig {
  public contextProviders: Map<string, Context<unknown>>;

  constructor() {
    super();
    this.contextProviders = new Map();
  }

  public addContextProvider = <C>(
    name: string,
    context: Context<C>
  ): Config => {
    this.contextProviders.set(name, context as Context<unknown>);
    return this;
  };
}
