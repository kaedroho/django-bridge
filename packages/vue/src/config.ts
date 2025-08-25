/* eslint-disable  @typescript-eslint/no-explicit-any */

import { InjectionKey } from "vue";
import { Config as CommonConfig } from "@common";

export default class Config extends CommonConfig {
  public contextProviders: Map<string, InjectionKey<unknown>>;

  constructor() {
    super();
    this.contextProviders = new Map();
  }

  public addContextProvider = <C>(
    name: string,
    injectionKey: InjectionKey<C>
  ): Config => {
    this.contextProviders.set(name, injectionKey as InjectionKey<unknown>);
    return this;
  };
}
