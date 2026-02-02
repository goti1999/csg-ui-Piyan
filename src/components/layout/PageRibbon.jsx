import { Button } from '@/components/ui/button.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  RefreshCw,
  Maximize2,
  Pin,
  Calendar,
  Filter,
  LayoutDashboard,
} from 'lucide-react';

/**
 * Power BI–style ribbon for Dashboard and Reports.
 * Export, Refresh, Print, Fullscreen, Pin, optional date range.
 */
export function PageRibbon({
  title = 'Ribbon',
  onExportCsv,
  onExportExcel,
  onPrint,
  onRefresh,
  onFullscreen,
  onPin,
  showDateRange = false,
  dateRange,
  onDateRangeChange,
  showFilter = false,
  onFilter,
  extra = null,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
      <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground mr-2">
        <LayoutDashboard className="h-4 w-4" />
        {title}
      </div>
      <Separator orientation="vertical" className="h-6" />
      {(onExportCsv || onExportExcel) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {onExportCsv && (
              <DropdownMenuItem onClick={onExportCsv} className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                CSV
              </DropdownMenuItem>
            )}
            {onExportExcel && (
              <DropdownMenuItem onClick={onExportExcel} className="gap-2">
                <FileText className="h-4 w-4" />
                Excel
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {onRefresh && (
        <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      )}
      {onPrint && (
        <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={onPrint}>
          <Printer className="h-4 w-4" />
          Print
        </Button>
      )}
      {onFullscreen && (
        <Button variant="ghost" size="sm" className="gap-1.5 h-8" onClick={onFullscreen}>
          <Maximize2 className="h-4 w-4" />
          Fullscreen
        </Button>
      )}
      {onPin && (
        <Button variant="ghost" size="sm" className="gap-1.5 h-8" onClick={onPin}>
          <Pin className="h-4 w-4" />
          Pin
        </Button>
      )}
      {showDateRange && (dateRange != null || onDateRangeChange) && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={onDateRangeChange}>
            <Calendar className="h-4 w-4" />
            {dateRange || 'Date range'}
          </Button>
        </>
      )}
      {showFilter && onFilter && (
        <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={onFilter}>
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      )}
      {extra}
    </div>
  );
}
