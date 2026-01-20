import { createContext, useContext, useState, ReactNode } from 'react';
import { BuilderState, CanvasComponent, PageDefinition } from './types';

interface BuilderContextType extends BuilderState {
  addComponent: (component: CanvasComponent) => void;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  setMode: (mode: 'edit' | 'preview') => void;
  createPage: (name: string, route: string) => void;
  selectPage: (pageId: string) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BuilderState>({
    currentPage: 'default',
    pages: [
      {
        id: 'default',
        name: 'Home Page',
        route: '/custom',
        components: [],
        settings: {},
      },
    ],
    selectedComponentId: null,
    mode: 'edit',
  });

  const getCurrentPage = () => state.pages.find((p) => p.id === state.currentPage)!;

  const addComponent = (component: CanvasComponent) => {
    setState((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id === prev.currentPage
          ? { ...page, components: [...page.components, component] }
          : page
      ),
    }));
  };

  const updateComponent = (id: string, updates: Partial<CanvasComponent>) => {
    setState((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id === prev.currentPage
          ? {
              ...page,
              components: page.components.map((c) =>
                c.id === id ? { ...c, ...updates } : c
              ),
            }
          : page
      ),
    }));
  };

  const deleteComponent = (id: string) => {
    setState((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id === prev.currentPage
          ? { ...page, components: page.components.filter((c) => c.id !== id) }
          : page
      ),
      selectedComponentId: prev.selectedComponentId === id ? null : prev.selectedComponentId,
    }));
  };

  const selectComponent = (id: string | null) => {
    setState((prev) => ({ ...prev, selectedComponentId: id }));
  };

  const setMode = (mode: 'edit' | 'preview') => {
    setState((prev) => ({ ...prev, mode }));
  };

  const createPage = (name: string, route: string) => {
    const newPage: PageDefinition = {
      id: `page-${Date.now()}`,
      name,
      route,
      components: [],
      settings: {},
    };
    setState((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
      currentPage: newPage.id,
    }));
  };

  const selectPage = (pageId: string) => {
    setState((prev) => ({ ...prev, currentPage: pageId, selectedComponentId: null }));
  };

  return (
    <BuilderContext.Provider
      value={{
        ...state,
        addComponent,
        updateComponent,
        deleteComponent,
        selectComponent,
        setMode,
        createPage,
        selectPage,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within BuilderProvider');
  }
  return context;
}
