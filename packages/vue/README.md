# @django-bridge/vue

The Vue 3 integration for Django Bridge - the simple way to build Django applications with modern Vue frontends.

## Installation

```bash
npm install @django-bridge/vue vue
```

## Usage

### Basic Setup

```typescript
import { createApp } from 'vue';
import { App, Config } from '@django-bridge/vue';
import './index.css';

import HomeView from './views/Home';
import { CSRFTokenContext } from './contexts';
import FormDef from './adapters/Form';
import FieldDef from './adapters/Field';
import ServerRenderedFieldDef from './adapters/ServerRenderedField';
import TextInputDef from './adapters/widgets/TextInput';
import SelectDef from './adapters/widgets/Select';
import CurrentTimeView from './views/CurrentTimeView';

const config = new Config();

// Add your views here
config.addView('Home', HomeView);

// Add your context providers here (Vue injection keys)
config.addContextProvider('csrf_token', CSRFTokenContext);

// Add your adapters here
config.addAdapter('forms.Form', FormDef);
config.addAdapter('forms.Field', FieldDef);
config.addAdapter('forms.ServerRenderedField', ServerRenderedFieldDef);
config.addAdapter('forms.TextInput', TextInputDef);
config.addAdapter('forms.Select', SelectDef);
config.addView('CurrentTime', CurrentTimeView);

const rootElement = document.getElementById('root')!;
const initialResponse = JSON.parse(
  document.getElementById('initial-response')!.textContent!
);

const app = createApp(App, {
  config,
  initialResponse
});

app.mount(rootElement);
```

### Component Imports

Import components directly from the package:

```vue
<template>
  <Form @submit="handleSubmit">
    <input name="field1" v-model="field1" />
    <Link href="/some-path">Navigate</Link>
    <button type="submit">Submit</button>
  </Form>
</template>

<script setup>
import Form from '@django-bridge/vue/components/Form.vue';
import Link from '@django-bridge/vue/components/Link.vue';
</script>
```

### Using Composables

```vue
<script setup>
import { useAutoRefresh, useNavigationController } from '@django-bridge/vue';
import { inject } from 'vue';

// Auto-refresh every 5 seconds
useAutoRefresh(enabled.value, 5000);

// Access navigation
const navigation = inject(NavigationKey);
</script>
```

### Available Components

- `App.vue` - Main application component
- `components/Form.vue` - Django-integrated form component
- `components/Link.vue` - Navigation link component
- `components/Browser.vue` - Main browser component
- `components/Overlay.vue` - Modal overlay component
- `components/RenderFrame.vue` - Frame rendering component
- `components/DirtyFormScope.vue` - Dirty form wrapper
- `components/DirtyFormMarker.vue` - Dirty form marker

### Available Composables

- `useNavigationController` - Navigation state management
- `useAutoRefresh` - Auto-refresh functionality
- `useDirtyForm` - Dirty form state
- `useDirtyFormMarker` - Dirty form marker

### Available Injection Keys

- `NavigationKey` - Navigation context
- `MessagesKey` - Messages context
- `OverlayKey` - Overlay context
- `DirtyFormKey` - Dirty form context
- `FormSubmissionStatusKey` - Form submission status
- `FormWidgetChangeNotificationKey` - Form change notifications

## Building for Production

The package includes both CommonJS and ESM builds:

```json
{
  "dependencies": {
    "@django-bridge/vue": "^0.5.0"
  }
}
```

## Development

To build the package:

```bash
npm run build
```

To check types:

```bash
npm run check-types
```

## License

BSD-3-Clause
