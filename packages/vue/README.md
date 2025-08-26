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
<script setup>
import { Form, Link } from '@django-bridge/vue';
</script>

<template>
  <Form @submit="handleSubmit">
    <input name="field1" v-model="field1" />
    <Link href="/some-path">Navigate</Link>
    <button type="submit">Submit</button>
  </Form>
</template>
```

### Using Composables

```vue
<script setup>
import { useAutoRefresh, useNavigation, useMessages } from '@django-bridge/vue';

// Auto-refresh every 5 seconds
useAutoRefresh(enabled.value, 5000);

// Access navigation - much cleaner than inject!
const navigation = useNavigation();

// Access messages
const { messages, pushMessage } = useMessages();

// Navigate programmatically
const goToDashboard = () => {
  navigation.navigate('/dashboard');
};
</script>
```

### Available Components

- `App` - Main application component
- `Form` - Django-integrated form component
- `Link` - Navigation link component
- `RenderFrame` - Frame rendering component

### Available Composables

- `useNavigation` - Access navigation context (recommended)
- `useMessages` - Access messages context (recommended)
- `useAutoRefresh` - Auto-refresh functionality
- `useDirtyForm` - Dirty form state management
- `useDirtyFormMarker` - Dirty form marker
- `useDirtyFormScope` - Dirty form scope wrapper

### Available Types and Keys

- `Navigation` - Navigation interface type
- `Messages` - Messages interface type
- `DirtyForm` - Dirty form interface type
- `Timer` - Timer interface type
- `NavigationKey` - Navigation injection key
- `MessagesKey` - Messages injection key
- `OverlayKey` - Overlay injection key
- `DirtyFormKey` - Dirty form injection key

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
