import { useState } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useBuilder } from '../BuilderContext.jsx';
import { ComponentRenderer } from './ComponentRenderer.jsx';
import { Eye, Code2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';

export function BuilderCanvas() {
  const { pages, currentPage, mode, setMode, selectedComponentId, selectComponent } = useBuilder();
  const [dragOver, setDragOver] = useState(false);

  const page = pages.find((p) => p.id === currentPage);
  const components = page?.components || [];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    // Component addition is handled by ComponentPalette clicks
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Canvas Toolbar */}
      <div className="border-b bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-700">Canvas: {page?.name}</h3>
          <Badge variant="secondary" className="gap-1">
            {components.length} components
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'edit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('edit')}
            className="gap-2"
          >
            <Code2 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant={mode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('preview')}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-6">
        <div
          className={`min-h-[600px] bg-white rounded-lg border-2 transition-all ${
            dragOver
              ? 'border-sky-500 border-dashed bg-sky-50'
              : 'border-gray-200 border-dashed'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => mode === 'edit' && selectComponent(null)}
        >
          {components.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12">
              <Plus className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Drop components here</p>
              <p className="text-sm">Click or drag components from the palette</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {components.map((component) => {
                const isSelected = selectedComponentId === component.id;
                return (
                  <div
                    key={component.id}
                    onClick={(e) => {
                      if (mode === 'edit') {
                        e.stopPropagation();
                        selectComponent(component.id);
                      }
                    }}
                    className={`relative group transition-all ${
                      mode === 'edit'
                        ? 'cursor-pointer hover:ring-2 hover:ring-sky-300 rounded-lg'
                        : ''
                    } ${isSelected ? 'ring-2 ring-sky-500 shadow-lg' : ''}`}
                  >
                    {mode === 'edit' && isSelected && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge className="bg-sky-500 text-white shadow-md">Selected</Badge>
                      </div>
                    )}
                    <ComponentRenderer component={component} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
