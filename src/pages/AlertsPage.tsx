import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertsPage() {
  const alerts = [
    { id: 1, type: "warning", title: "Delayed Shipment", message: "Container CMAU7981211 is delayed", time: "5 min ago" },
    { id: 2, type: "success", title: "Delivery Complete", message: "Container MSCU5632147 delivered", time: "1 hour ago" },
    { id: 3, type: "info", title: "Schedule Update", message: "ETA updated for MBL BAC0581430", time: "2 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Bell className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md">Alerts & Notifications</h1>
            <p className="text-amber-100 mt-1">Real-time system notifications</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const icon = alert.type === 'warning' ? <AlertCircle className="h-4 w-4" /> : 
                       alert.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : 
                       <Info className="h-4 w-4" />;
          const variant = alert.type === 'warning' ? 'destructive' : 'default';
          
          return (
            <Alert key={alert.id} variant={variant}>
              {icon}
              <AlertTitle className="flex items-center justify-between">
                {alert.title}
                <Badge variant="outline" className="text-xs">{alert.time}</Badge>
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          );
        })}
      </div>
    </div>
  );
}
