import { createContext, useContext, useState } from 'react';

const BuilderContext = createContext(undefined);

export function BuilderProvider({ children }) {
  const [state, setState] = useState({
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

  const getCurrentPage = () => state.pages.find((p) => p.id === state.currentPage);

  const addComponent = (component) => {
    setState((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id === prev.currentPage
          ? { ...page, components: [...page.components, component] }
          : page
      ),
    }));
  };

  const updateComponent = (id, updates) => {
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

  const deleteComponent = (id) => {
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

  const selectComponent = (id) => {
    setState((prev) => ({ ...prev, selectedComponentId: id }));
  };

  const setMode = (mode) => {
    setState((prev) => ({ ...prev, mode }));
  };

  const createPage = (name, route) => {
    const newPage = {
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

  const selectPage = (pageId) => {
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
