/* eslint-disable  @typescript-eslint/no-explicit-any */

import Telepath from "./telepathUnpack";

export class Config<V> {
  public views: Map<string, V>;

  // Telepath Doesn't support typescript yet
  public telepathRegistry: Telepath;

  constructor() {
    this.views = new Map();
    this.telepathRegistry = new Telepath();

    // Add default adapters
    this.addAdapter("Date", Date);
  }

  public addView = <P>(name: string, component: V): Config<V> => {
    this.views.set(name, component);
    return this;
  };

  public addAdapter = <Cls>(
    name: string,
    ctor: { new (...args: any[]): Cls }
  ): Config<V> => {
    this.telepathRegistry.register(name, ctor);
    return this;
  };

  public unpack = (data: Record<string, unknown>): Record<string, unknown> =>
    this.telepathRegistry.unpack(data);
}
