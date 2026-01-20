// UI Builder Types - Similar to UI Bakery component system

export type ComponentType = 
  | 'button'
  | 'input'
  | 'select'
  | 'table'
  | 'card'
  | 'chart'
  | 'text'
  | 'image'
  | 'container'
  | 'form'
  | 'modal'
  | 'tabs'
  | 'divider'
  | 'badge'
  | 'alert';

export interface ComponentDefinition {
  id: string;
  type: ComponentType;
  name: string;
  icon: string;
  category: 'inputs' | 'display' | 'layout' | 'data' | 'actions';
  defaultProps: Record<string, any>;
  properties: PropertyDefinition[];
}

export interface PropertyDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'json';
  defaultValue: any;
  options?: Array<{ label: string; value: any }>;
}

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  children?: CanvasComponent[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface PageDefinition {
  id: string;
  name: string;
  route: string;
  components: CanvasComponent[];
  settings: Record<string, any>;
}

export interface BuilderState {
  currentPage: string;
  pages: PageDefinition[];
  selectedComponentId: string | null;
  mode: 'edit' | 'preview';
}
