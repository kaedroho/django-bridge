/* eslint-disable  @typescript-eslint/no-explicit-any */

import Telepath from "./telepathUnpack";

export class Config {
  public views: Map<string, any>;

  // Telepath Doesn't support typescript yet
  public telepathRegistry: Telepath;

  constructor() {
    this.views = new Map();
    this.telepathRegistry = new Telepath();

    // Add default adapters
    this.addAdapter("Date", Date);
  }

  public addView = <P>(name: string, component: any): Config => {
    this.views.set(name, component);
    return this;
  };

  public addAdapter = <Cls>(
    name: string,
    ctor: { new (...args: any[]): Cls }
  ): Config => {
    this.telepathRegistry.register(name, ctor);
    return this;
  };

  public unpack = (data: Record<string, unknown>): Record<string, unknown> =>
    this.telepathRegistry.unpack(data);
}
