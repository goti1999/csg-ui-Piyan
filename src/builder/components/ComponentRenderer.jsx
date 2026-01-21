import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Label } from '@/components/ui/label.jsx';

export function ComponentRenderer({ component }) {
  const { type, props } = component;

  switch (type) {
    case 'button':
      return (
        <Button variant={props.variant} size={props.size} disabled={props.disabled}>
          {props.text || 'Button'}
        </Button>
      );

    case 'input':
      return (
        <div className="space-y-2">
          {props.label && <Label>{props.label}</Label>}
          <Input
            type={props.type}
            placeholder={props.placeholder}
            required={props.required}
            disabled={props.disabled}
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          {props.label && <Label>{props.label}</Label>}
          <Select disabled={props.disabled}>
            <SelectTrigger>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {(props.options || []).map((opt, i) => (
                <SelectItem key={i} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'text':
      const TextTag = props.variant === 'h1' ? 'h1' : props.variant === 'h2' ? 'h2' : props.variant === 'h3' ? 'h3' : 'p';
      const textClass =
        props.variant === 'h1'
          ? 'text-3xl font-bold'
          : props.variant === 'h2'
          ? 'text-2xl font-bold'
          : props.variant === 'h3'
          ? 'text-xl font-semibold'
          : props.variant === 'small'
          ? 'text-sm'
          : 'text-base';
      return <TextTag className={textClass}>{props.content || 'Text'}</TextTag>;

    case 'badge':
      return <Badge variant={props.variant}>{props.text || 'Badge'}</Badge>;

    case 'alert':
      return (
        <Alert variant={props.variant}>
          <AlertTitle>{props.title || 'Alert'}</AlertTitle>
          <AlertDescription>{props.description || 'Alert message'}</AlertDescription>
        </Alert>
      );

    case 'card':
      return (
        <Card>
          {props.hasHeader && (
            <CardHeader>
              <CardTitle>{props.title || 'Card'}</CardTitle>
              {props.description && <CardDescription>{props.description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent>
            <p className="text-sm text-muted-foreground">Card content goes here</p>
          </CardContent>
        </Card>
      );

    case 'container':
      const paddingClass =
        props.padding === 'none'
          ? 'p-0'
          : props.padding === 'small'
          ? 'p-2'
          : props.padding === 'large'
          ? 'p-8'
          : 'p-4';
      return (
        <div className={`border rounded-lg ${paddingClass}`}>
          <p className="text-sm text-muted-foreground">Container - Drop components here</p>
        </div>
      );

    case 'tabs':
      return (
        <Tabs defaultValue={props.tabs?.[0] || 'tab1'}>
          <TabsList>
            {(props.tabs || ['Tab 1', 'Tab 2']).map((tab, i) => (
              <TabsTrigger key={i} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {(props.tabs || ['Tab 1', 'Tab 2']).map((tab, i) => (
            <TabsContent key={i} value={tab}>
              <p className="text-sm text-muted-foreground">Content for {tab}</p>
            </TabsContent>
          ))}
        </Tabs>
      );

    case 'table':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Column 1</th>
                    <th className="p-3 text-left">Column 2</th>
                    <th className="p-3 text-left">Column 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Sample data</td>
                    <td className="p-3">Sample data</td>
                    <td className="p-3">Sample data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      );

    case 'form':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{props.title || 'Form'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Field 1</Label>
              <Input placeholder="Enter value..." />
            </div>
            <Button>{props.submitText || 'Submit'}</Button>
          </CardContent>
        </Card>
      );

    case 'modal':
      return (
        <Button variant="outline">{props.triggerText || 'Open Modal'}</Button>
      );

    case 'divider':
      return <Separator orientation={props.orientation} />;

    case 'chart':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{props.title || 'Chart'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              📈 {props.chartType || 'line'} chart preview
            </div>
          </CardContent>
        </Card>
      );

    default:
      return (
        <div className="p-4 border border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">Unknown component: {type}</p>
        </div>
      );
  }
}
