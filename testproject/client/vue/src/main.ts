import { createApp } from "vue";
import * as DjangoBridge from "@django-bridge/vue";
import "./index.css";

import HomeView from "./views/Home.vue";
import NavigationView from "./views/Navigation.vue";
import { CSRFTokenKey } from "./contexts";
import { FormDef } from "./adapters/Form";
import { FieldDef } from "./adapters/Field";
import { ServerRenderedFieldDef } from "./adapters/ServerRenderedField";
import { TextInputDef } from "./adapters/widgets/TextInput";
import { SelectDef } from "./adapters/widgets/Select";

const config = new DjangoBridge.Config();

// Add your views here
config.addView("Home", HomeView);
config.addView("Navigation", NavigationView);

// Add your context providers here
config.addContextProvider("csrf_token", CSRFTokenKey);

// Add your adapters here
config.addAdapter("forms.Form", FormDef);
config.addAdapter("forms.Field", FieldDef);
config.addAdapter("forms.ServerRenderedField", ServerRenderedFieldDef);
config.addAdapter("forms.TextInput", TextInputDef);
config.addAdapter("forms.Select", SelectDef);

const initialResponse = JSON.parse(
  document.getElementById("initial-response")!.textContent!
);

const app = createApp(DjangoBridge.App, {
  config,
  initialResponse,
});

app.mount("#root");
