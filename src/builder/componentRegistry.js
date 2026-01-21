// Component Registry - All available UI Bakery-style components

export const COMPONENT_REGISTRY = [
  // INPUT COMPONENTS
  {
    id: 'input',
    type: 'input',
    name: 'Input Field',
    icon: '📝',
    category: 'inputs',
    defaultProps: {
      placeholder: 'Enter text...',
      label: 'Input',
      required: false,
      disabled: false,
      type: 'text',
    },
    properties: [
      { name: 'label', label: 'Label', type: 'text', defaultValue: 'Input' },
      { name: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: '' },
      { name: 'type', label: 'Type', type: 'select', defaultValue: 'text', options: [
        { label: 'Text', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'Password', value: 'password' },
        { label: 'Number', value: 'number' },
      ]},
      { name: 'required', label: 'Required', type: 'boolean', defaultValue: false },
      { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'button',
    type: 'button',
    name: 'Button',
    icon: '🔘',
    category: 'inputs',
    defaultProps: {
      text: 'Click me',
      variant: 'default',
      size: 'default',
      disabled: false,
    },
    properties: [
      { name: 'text', label: 'Text', type: 'text', defaultValue: 'Button' },
      { name: 'variant', label: 'Variant', type: 'select', defaultValue: 'default', options: [
        { label: 'Default', value: 'default' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
        { label: 'Destructive', value: 'destructive' },
      ]},
      { name: 'size', label: 'Size', type: 'select', defaultValue: 'default', options: [
        { label: 'Small', value: 'sm' },
        { label: 'Default', value: 'default' },
        { label: 'Large', value: 'lg' },
      ]},
      { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'select',
    type: 'select',
    name: 'Select Dropdown',
    icon: '📋',
    category: 'inputs',
    defaultProps: {
      label: 'Select',
      placeholder: 'Choose option...',
      options: ['Option 1', 'Option 2', 'Option 3'],
      disabled: false,
    },
    properties: [
      { name: 'label', label: 'Label', type: 'text', defaultValue: 'Select' },
      { name: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Choose...' },
      { name: 'options', label: 'Options', type: 'json', defaultValue: [] },
      { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
    ],
  },

  // DISPLAY COMPONENTS
  {
    id: 'text',
    type: 'text',
    name: 'Text',
    icon: '📄',
    category: 'display',
    defaultProps: {
      content: 'Text content',
      variant: 'body',
      color: 'default',
    },
    properties: [
      { name: 'content', label: 'Content', type: 'text', defaultValue: 'Text' },
      { name: 'variant', label: 'Variant', type: 'select', defaultValue: 'body', options: [
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Body', value: 'body' },
        { label: 'Small', value: 'small' },
      ]},
    ],
  },
  {
    id: 'badge',
    type: 'badge',
    name: 'Badge',
    icon: '🏷️',
    category: 'display',
    defaultProps: {
      text: 'Badge',
      variant: 'default',
    },
    properties: [
      { name: 'text', label: 'Text', type: 'text', defaultValue: 'Badge' },
      { name: 'variant', label: 'Variant', type: 'select', defaultValue: 'default', options: [
        { label: 'Default', value: 'default' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Destructive', value: 'destructive' },
      ]},
    ],
  },
  {
    id: 'alert',
    type: 'alert',
    name: 'Alert',
    icon: '⚠️',
    category: 'display',
    defaultProps: {
      title: 'Alert',
      description: 'This is an alert message',
      variant: 'default',
    },
    properties: [
      { name: 'title', label: 'Title', type: 'text', defaultValue: 'Alert' },
      { name: 'description', label: 'Description', type: 'text', defaultValue: 'Message' },
      { name: 'variant', label: 'Variant', type: 'select', defaultValue: 'default', options: [
        { label: 'Default', value: 'default' },
        { label: 'Destructive', value: 'destructive' },
      ]},
    ],
  },

  // LAYOUT COMPONENTS
  {
    id: 'card',
    type: 'card',
    name: 'Card',
    icon: '🎴',
    category: 'layout',
    defaultProps: {
      title: 'Card Title',
      description: 'Card description',
      hasHeader: true,
    },
    properties: [
      { name: 'title', label: 'Title', type: 'text', defaultValue: 'Card' },
      { name: 'description', label: 'Description', type: 'text', defaultValue: '' },
      { name: 'hasHeader', label: 'Show Header', type: 'boolean', defaultValue: true },
    ],
  },
  {
    id: 'container',
    type: 'container',
    name: 'Container',
    icon: '📦',
    category: 'layout',
    defaultProps: {
      padding: 'default',
      background: 'transparent',
    },
    properties: [
      { name: 'padding', label: 'Padding', type: 'select', defaultValue: 'default', options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Default', value: 'default' },
        { label: 'Large', value: 'large' },
      ]},
    ],
  },
  {
    id: 'tabs',
    type: 'tabs',
    name: 'Tabs',
    icon: '📑',
    category: 'layout',
    defaultProps: {
      tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
      defaultValue: 'Tab 1',
    },
    properties: [
      { name: 'tabs', label: 'Tab Names', type: 'json', defaultValue: [] },
    ],
  },

  // DATA COMPONENTS
  {
    id: 'table',
    type: 'table',
    name: 'Data Table',
    icon: '📊',
    category: 'data',
    defaultProps: {
      columns: [],
      data: [],
      sortable: true,
      filterable: true,
      pagination: true,
      pageSize: 10,
    },
    properties: [
      { name: 'sortable', label: 'Sortable', type: 'boolean', defaultValue: true },
      { name: 'filterable', label: 'Filterable', type: 'boolean', defaultValue: true },
      { name: 'pagination', label: 'Pagination', type: 'boolean', defaultValue: true },
      { name: 'pageSize', label: 'Page Size', type: 'number', defaultValue: 10 },
    ],
  },
  {
    id: 'chart',
    type: 'chart',
    name: 'Chart',
    icon: '📈',
    category: 'data',
    defaultProps: {
      chartType: 'line',
      data: [],
      title: 'Chart',
    },
    properties: [
      { name: 'title', label: 'Title', type: 'text', defaultValue: 'Chart' },
      { name: 'chartType', label: 'Chart Type', type: 'select', defaultValue: 'line', options: [
        { label: 'Line', value: 'line' },
        { label: 'Bar', value: 'bar' },
        { label: 'Pie', value: 'pie' },
        { label: 'Area', value: 'area' },
      ]},
    ],
  },

  // ACTION COMPONENTS
  {
    id: 'form',
    type: 'form',
    name: 'Form',
    icon: '📋',
    category: 'actions',
    defaultProps: {
      title: 'Form',
      submitText: 'Submit',
    },
    properties: [
      { name: 'title', label: 'Title', type: 'text', defaultValue: 'Form' },
      { name: 'submitText', label: 'Submit Button Text', type: 'text', defaultValue: 'Submit' },
    ],
  },
  {
    id: 'modal',
    type: 'modal',
    name: 'Modal Dialog',
    icon: '🪟',
    category: 'actions',
    defaultProps: {
      title: 'Modal',
      triggerText: 'Open Modal',
    },
    properties: [
      { name: 'title', label: 'Title', type: 'text', defaultValue: 'Modal' },
      { name: 'triggerText', label: 'Trigger Text', type: 'text', defaultValue: 'Open' },
    ],
  },
  {
    id: 'divider',
    type: 'divider',
    name: 'Divider',
    icon: '➖',
    category: 'layout',
    defaultProps: {
      orientation: 'horizontal',
    },
    properties: [
      { name: 'orientation', label: 'Orientation', type: 'select', defaultValue: 'horizontal', options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ]},
    ],
  },
];

export function getComponentDefinition(type) {
  return COMPONENT_REGISTRY.find((c) => c.type === type);
}

export function getComponentsByCategory(category) {
  return COMPONENT_REGISTRY.filter((c) => c.category === category);
}
