import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Calendar, MapPin, Package, TrendingUp } from 'lucide-react';

export function ExpandableRowDetails({ row }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 border-t-2 border-sky-200">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Status Section */}
        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Status Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <DetailField label="Status" value={
              <Badge variant={row.status === 'on-time' ? 'default' : row.status === 'completed' ? 'secondary' : 'destructive'}>
                {row.status}
              </Badge>
            } />
            <DetailField label="Priority" value={
              <Badge variant="outline" className="capitalize">{row.priority}</Badge>
            } />
            <DetailField label="Progress" value={`${row.progress}%`} />
            <DetailField label="Category" value={row.category} />
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-1">Progress Bar</div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                  style={{ width: `${row.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Information */}
        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="pb-3 bg-gradient-to-r from-sky-50 to-blue-50 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Package className="h-4 w-4 text-sky-600" />
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <DetailField label="ID" value={row.id} />
            <DetailField label="Name" value={row.name} className="font-medium" />
            <DetailField label="Location" value={
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {row.location}
              </span>
            } />
            <DetailField label="Amount" value={`$${row.amount.toLocaleString()}`} className="font-semibold text-sky-600" />
            <DetailField label="Last Updated" value={new Date(row.updated).toLocaleString()} />
          </CardContent>
        </Card>

        {/* Termine (Dates/Times) */}
        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              Termine (Dates)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <DetailField 
              label="ETA" 
              value={new Date(row.eta).toLocaleDateString('de-DE', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              className="font-medium"
            />
            <DetailField 
              label="Created" 
              value={new Date(row.updated).toLocaleDateString('de-DE')} 
            />
            <Separator />
            <div className="pt-2">
              <div className="text-xs font-semibold text-purple-600 mb-2">Timeline Status</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transmission</span>
                  <Badge variant="outline" className="text-xs">Completed</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">In Transit</span>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <Badge variant="outline" className="text-xs">Pending</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailField({ label, value, className }) {
  return (
    <div className="flex justify-between items-start gap-3">
      <span className="text-xs text-muted-foreground font-medium min-w-[100px]">{label}:</span>
      <span className={`text-sm text-right ${className || ''}`}>{value}</span>
    </div>
  );
}
