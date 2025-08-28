import { Component } from "vue";

export interface WidgetDef {
  render(id: string, name: string, disabled: boolean, value: string): Component;
}
