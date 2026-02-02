/**
 * Trigger & action registry (UI Bakery–style). Import from @/lib/triggers.
 * Actions can have multiple steps: customCode (JS), sql, loadData, navigate, openModal.
 */

export const TRIGGER_TYPES = [
  { id: 'onInit', label: 'On init', description: 'When component loads', components: ['table', 'card', 'chart', 'form'] },
  { id: 'onSubmit', label: 'On submit', description: 'When form is submitted', components: ['form'] },
  { id: 'onClick', label: 'On click', description: 'When element is clicked', components: ['table', 'card', 'button'] },
  { id: 'onRowClick', label: 'On row click', description: 'When table row is clicked', components: ['table'] },
  { id: 'onChange', label: 'On change', description: 'When value changes', components: ['form', 'input', 'select'] },
];

export const ACTION_TYPES = [
  { id: 'loadData', label: 'Load data', description: 'Load data from source (dummy or database)', icon: 'Database' },
  { id: 'navigate', label: 'Navigate', description: 'Navigate to page', icon: 'Compass' },
  { id: 'api', label: 'Call API', description: 'HTTP request', icon: 'Globe' },
  { id: 'custom', label: 'Custom code', description: 'Run JavaScript', icon: 'Code' },
  { id: 'modal', label: 'Open modal', description: 'Show modal/dialog', icon: 'Square' },
];

/** Step types for action config (UI Bakery–style). Use in Edit panel → Add action → Add step. */
export const STEP_TYPES = [
  { id: 'customCode', label: 'JavaScript', description: 'Run custom JS code', icon: 'Code' },
  { id: 'sql', label: 'SQL', description: 'Execute SQL (DB credentials required)', icon: 'Database' },
  { id: 'loadData', label: 'Load data', description: 'Fetch from data source', icon: 'Database' },
  { id: 'navigate', label: 'Navigate', description: 'Go to page', icon: 'Compass' },
  { id: 'openModal', label: 'Open modal', description: 'Show dialog/modal', icon: 'Square' },
];

export function getTriggersForComponent(componentType) {
  return TRIGGER_TYPES.filter((t) => t.components.includes(componentType));
}
