import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { useBuilder } from '../BuilderContext.jsx';
import { getComponentDefinition } from '../componentRegistry.js';
import { Settings, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator.jsx';

export function PropertiesPanel() {
  const { selectedComponentId, pages, currentPage, updateComponent, deleteComponent } = useBuilder();
  
  const currentPageData = pages.find((p) => p.id === currentPage);
  const selectedComponent = currentPageData?.components.find((c) => c.id === selectedComponentId);
  
  if (!selectedComponent) {
    return (
      <Card className="h-full border-l shadow-lg bg-white">
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a component to edit its properties</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const componentDef = getComponentDefinition(selectedComponent.type);
  if (!componentDef) return null;

  const handlePropertyChange = (propName, value) => {
    updateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, [propName]: value },
    });
  };

  return (
    <Card className="h-full border-l shadow-lg bg-white">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Properties
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteComponent(selectedComponent.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {componentDef.icon} {componentDef.name}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase">Component ID</Label>
              <Input value={selectedComponent.id} disabled className="text-xs" />
            </div>

            <Separator />

            {componentDef.properties.map((prop) => (
              <div key={prop.name} className="space-y-2">
                <Label htmlFor={prop.name} className="text-sm font-medium">
                  {prop.label}
                </Label>
                
                {prop.type === 'text' && (
                  <Input
                    id={prop.name}
                    value={selectedComponent.props[prop.name] || ''}
                    onChange={(e) => handlePropertyChange(prop.name, e.target.value)}
                    placeholder={prop.defaultValue}
                  />
                )}
                
                {prop.type === 'number' && (
                  <Input
                    id={prop.name}
                    type="number"
                    value={selectedComponent.props[prop.name] || ''}
                    onChange={(e) => handlePropertyChange(prop.name, Number(e.target.value))}
                  />
                )}
                
                {prop.type === 'boolean' && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id={prop.name}
                      checked={selectedComponent.props[prop.name] || false}
                      onCheckedChange={(checked) => handlePropertyChange(prop.name, checked)}
                    />
                    <Label htmlFor={prop.name} className="text-sm text-muted-foreground">
                      {selectedComponent.props[prop.name] ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                )}
                
                {prop.type === 'select' && prop.options && (
                  <Select
                    value={selectedComponent.props[prop.name] || prop.defaultValue}
                    onValueChange={(value) => handlePropertyChange(prop.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prop.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {prop.type === 'json' && (
                  <Textarea
                    id={prop.name}
                    value={JSON.stringify(selectedComponent.props[prop.name] || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        handlePropertyChange(prop.name, parsed);
                      } catch (err) {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={4}
                    className="font-mono text-xs"
                  />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
