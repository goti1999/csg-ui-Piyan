import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { Settings, Move, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export function EditableWrapper({
  children,
  componentId,
  componentName,
  componentType,
  onEdit,
  onDelete,
  onDuplicate,
  className,
}) {
  const { editMode, selectedComponentId, selectComponent } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const isSelected = selectedComponentId === componentId;

  if (!editMode) {
    return <>{children}</>;
  }

  const handleClick = (e) => {
    e.stopPropagation();
    selectComponent(componentId);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this component?')) {
      onDelete?.();
    }
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    onDuplicate?.();
  };

  const toggleVisibility = (e) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  const getTypeColor = () => {
    switch (componentType) {
      case 'table': return 'bg-blue-500';
      case 'card': return 'bg-emerald-500';
      case 'chart': return 'bg-purple-500';
      case 'form': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 rounded-lg',
        isHovered && !isSelected && 'ring-2 ring-blue-300 ring-offset-1 rounded-lg',
        !isVisible && 'opacity-30',
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Component Label */}
      <div
        className={cn(
          'absolute -top-8 left-0 z-20 flex items-center gap-2 transition-opacity duration-200',
          (isHovered || isSelected) ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Badge className={cn('text-xs font-bold text-white shadow-lg', getTypeColor())}>
          {componentType.toUpperCase()}
        </Badge>
        <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded shadow-sm">
          {componentName}
        </span>
      </div>

      {/* Edit Controls */}
      <div
        className={cn(
          'absolute -top-8 right-0 z-20 flex items-center gap-1 transition-opacity duration-200',
          (isHovered || isSelected) ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-white shadow-md hover:bg-blue-50 border-blue-200"
          onClick={handleEdit}
          title="Edit Component"
        >
          <Settings className="h-3.5 w-3.5 text-blue-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-white shadow-md hover:bg-slate-50 border-slate-200"
          title="Move"
        >
          <Move className="h-3.5 w-3.5 text-slate-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-white shadow-md hover:bg-emerald-50 border-emerald-200"
          onClick={handleDuplicate}
          title="Duplicate"
        >
          <Copy className="h-3.5 w-3.5 text-emerald-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-white shadow-md hover:bg-amber-50 border-amber-200"
          onClick={toggleVisibility}
          title={isVisible ? 'Hide' : 'Show'}
        >
          {isVisible ? (
            <Eye className="h-3.5 w-3.5 text-amber-600" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-amber-600" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-white shadow-md hover:bg-red-50 border-red-200"
          onClick={handleDelete}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-600" />
        </Button>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-blue-500 text-white text-xs shadow-lg">
            Selected - Click Edit to modify
          </Badge>
        </div>
      )}

      {/* Children */}
      <div className={cn(!isVisible && 'pointer-events-none')}>
        {children}
      </div>
    </div>
  );
}
