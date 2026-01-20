import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { COMPONENT_REGISTRY } from '../componentRegistry';
import { useBuilder } from '../BuilderContext';
import { CanvasComponent } from '../types';
import { Layers, Box, MousePointer, Database, Zap } from 'lucide-react';

const CATEGORY_ICONS = {
  inputs: <MousePointer className="h-4 w-4" />,
  display: <Layers className="h-4 w-4" />,
  layout: <Box className="h-4 w-4" />,
  data: <Database className="h-4 w-4" />,
  actions: <Zap className="h-4 w-4" />,
};

export function ComponentPalette() {
  const { addComponent } = useBuilder();

  const handleDragStart = (e: React.DragEvent, componentDef: any) => {
    e.dataTransfer.setData('componentType', componentDef.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddComponent = (componentDef: any) => {
    const newComponent: CanvasComponent = {
      id: `${componentDef.type}-${Date.now()}`,
      type: componentDef.type,
      props: { ...componentDef.defaultProps },
    };
    addComponent(newComponent);
  };

  const categories = ['inputs', 'display', 'layout', 'data', 'actions'];

  return (
    <Card className="h-full border-r shadow-lg bg-white">
      <CardHeader className="border-b bg-gradient-to-r from-sky-50 to-blue-50">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Box className="h-5 w-5 text-sky-600" />
          Component Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="w-full grid grid-cols-5 rounded-none border-b">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize text-xs">
                {CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="m-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-3 space-y-2">
                  {COMPONENT_REGISTRY.filter((c) => c.category === category).map((comp) => (
                    <div
                      key={comp.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, comp)}
                      className="group"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 hover:bg-sky-50 hover:border-sky-300 cursor-move transition-all"
                        onClick={() => handleAddComponent(comp)}
                      >
                        <span className="text-lg">{comp.icon}</span>
                        <span className="text-sm font-medium">{comp.name}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
