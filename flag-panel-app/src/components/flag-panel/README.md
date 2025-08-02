# FlagPanel Component

A comprehensive React component for managing feature flags with a modern, user-friendly interface built with Ant Design.

## Features

- 🚀 **Toggle Flags**: Enable/disable feature flags with a simple switch
- 🔍 **Search & Filter**: Search flags by name/description and filter by category/environment
- ➕ **Create Flags**: Add new feature flags with a modal form
- ✏️ **Edit Flags**: Modify existing flags with inline editing
- 🗑️ **Delete Flags**: Remove flags with confirmation dialog
- 🏷️ **Tagging System**: Add custom tags to organize flags
- 📊 **Environment Support**: Support for development, staging, and production environments
- 🎨 **Modern UI**: Beautiful interface with Ant Design components
- 📱 **Responsive**: Works on desktop and mobile devices
- ⚡ **TypeScript**: Fully typed with TypeScript support

## Installation

The component is already included in the project. Make sure you have the required dependencies:

```bash
npm install antd @ant-design/icons
```

## Usage

### Basic Usage

```tsx
import { FlagPanel, Flag } from './components/flag-panel';

const MyComponent = () => {
  const [flags, setFlags] = useState<Flag[]>([]);

  const handleFlagToggle = (flagId: string, enabled: boolean) => {
    // Handle flag toggle logic
    console.log(`Flag ${flagId} ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <FlagPanel
      flags={flags}
      onFlagToggle={handleFlagToggle}
    />
  );
};
```

### Advanced Usage with All Features

```tsx
import { FlagPanel, Flag } from './components/flag-panel';

const MyComponent = () => {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFlagToggle = (flagId: string, enabled: boolean) => {
    setFlags(prevFlags =>
      prevFlags.map(flag =>
        flag.id === flagId
          ? { ...flag, enabled, updatedAt: new Date().toISOString() }
          : flag
      )
    );
  };

  const handleFlagCreate = (newFlag: Omit<Flag, 'id' | 'createdAt' | 'updatedAt'>) => {
    const flag: Flag = {
      ...newFlag,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFlags(prevFlags => [...prevFlags, flag]);
  };

  const handleFlagEdit = (flagId: string, updates: Partial<Flag>) => {
    setFlags(prevFlags =>
      prevFlags.map(flag =>
        flag.id === flagId
          ? { ...flag, ...updates, updatedAt: new Date().toISOString() }
          : flag
      )
    );
  };

  const handleFlagDelete = (flagId: string) => {
    setFlags(prevFlags => prevFlags.filter(flag => flag.id !== flagId));
  };

  return (
    <FlagPanel
      flags={flags}
      onFlagToggle={handleFlagToggle}
      onFlagCreate={handleFlagCreate}
      onFlagEdit={handleFlagEdit}
      onFlagDelete={handleFlagDelete}
      loading={loading}
      title="Feature Flags Management"
      showCreateButton={true}
      showSearch={true}
      showCategories={true}
    />
  );
};
```

## Props

### FlagPanelProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `flags` | `Flag[]` | `[]` | Array of flag objects to display |
| `onFlagToggle` | `(flagId: string, enabled: boolean) => void` | `undefined` | Callback when a flag is toggled |
| `onFlagCreate` | `(flag: Omit<Flag, 'id' \| 'createdAt' \| 'updatedAt'>) => void` | `undefined` | Callback when a new flag is created |
| `onFlagEdit` | `(flagId: string, updates: Partial<Flag>) => void` | `undefined` | Callback when a flag is edited |
| `onFlagDelete` | `(flagId: string) => void` | `undefined` | Callback when a flag is deleted |
| `loading` | `boolean` | `false` | Show loading spinner |
| `title` | `string` | `'Feature Flags'` | Title displayed in the header |
| `showCreateButton` | `boolean` | `true` | Show/hide the create button |
| `showSearch` | `boolean` | `true` | Show/hide search functionality |
| `showCategories` | `boolean` | `true` | Show/hide category and environment filters |
| `className` | `string` | `undefined` | Additional CSS class name |

### Flag Interface

```tsx
interface Flag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  environment: 'development' | 'staging' | 'production';
  createdAt: string;
  updatedAt: string;
  owner?: string;
  tags?: string[];
}
```

## Sample Data Structure

```tsx
const sampleFlags: Flag[] = [
  {
    id: '1',
    name: 'New User Dashboard',
    description: 'Enable the new user dashboard with enhanced analytics.',
    enabled: true,
    category: 'feature',
    environment: 'production',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    owner: 'John Doe',
    tags: ['urgent', 'new'],
  },
  // ... more flags
];
```

## Features in Detail

### 1. Flag Management
- **Toggle**: Switch flags on/off with immediate visual feedback
- **Create**: Add new flags with a comprehensive form
- **Edit**: Modify existing flags with pre-filled forms
- **Delete**: Remove flags with confirmation dialog

### 2. Search & Filtering
- **Search**: Find flags by name or description
- **Category Filter**: Filter by feature, experiment, maintenance, security
- **Environment Filter**: Filter by development, staging, production

### 3. Visual Indicators
- **Status Icons**: Green checkmark for enabled, red X for disabled
- **Environment Tags**: Color-coded tags (blue=dev, orange=staging, red=production)
- **Category Tags**: Blue tags for flag categories
- **Custom Tags**: User-defined tags for organization

### 4. Responsive Design
- Works seamlessly on desktop and mobile devices
- Adaptive layout with proper spacing and typography
- Touch-friendly controls

## Demo

Visit `/flag-panel` in the application to see a live demo with sample data.

## Customization

### Styling
The component uses Ant Design's design system. You can customize the appearance by:

1. Overriding Ant Design theme variables
2. Adding custom CSS classes via the `className` prop
3. Modifying the component's internal styles

### Categories
Default categories include:
- `feature`: New features and enhancements
- `experiment`: A/B testing and experiments
- `maintenance`: System maintenance flags
- `security`: Security-related features

You can extend these by modifying the Select options in the create/edit forms.

### Environments
Supported environments:
- `development`: Development environment
- `staging`: Staging/testing environment
- `production`: Production environment

## Best Practices

1. **Naming**: Use descriptive, consistent names for flags
2. **Descriptions**: Provide clear, detailed descriptions
3. **Categories**: Use appropriate categories for organization
4. **Tags**: Use tags for additional organization and filtering
5. **Ownership**: Assign owners for accountability
6. **Cleanup**: Remove deprecated flags regularly

## Contributing

When contributing to this component:

1. Follow the existing code style
2. Add TypeScript types for new features
3. Update the documentation
4. Test with different screen sizes
5. Ensure accessibility compliance

## License

This component is part of the project and follows the same license terms. 