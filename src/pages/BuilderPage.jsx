import { BuilderProvider } from '@/builder/BuilderContext.jsx';
import { ComponentPalette } from '@/builder/components/ComponentPalette.jsx';
import { PropertiesPanel } from '@/builder/components/PropertiesPanel.jsx';
import { BuilderCanvas } from '@/builder/components/BuilderCanvas.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Save, Download, Upload, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function BuilderPage() {
  const handleSave = () => {
    toast.success('Page configuration saved!');
  };

  const handleExport = () => {
    toast.success('Page exported as JSON!');
  };

  return (
    <BuilderProvider>
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-100 to-sky-100">
        {/* Builder Toolbar */}
        <div className="border-b bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">Visual Page Builder</h1>
              <p className="text-sm text-white/80">Drag & drop components to build your page</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="gap-2 bg-white hover:bg-sky-50" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-white/30 text-white hover:bg-white/20" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-white/30 text-white hover:bg-white/20">
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/20">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Builder Layout: Palette | Canvas | Properties */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Component Palette */}
          <div className="w-72 shrink-0">
            <ComponentPalette />
          </div>

          {/* Middle - Canvas */}
          <div className="flex-1">
            <BuilderCanvas />
          </div>

          {/* Right Sidebar - Properties Panel */}
          <div className="w-80 shrink-0">
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </BuilderProvider>
  );
}
