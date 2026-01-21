import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Settings className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md">Settings</h1>
            <p className="text-indigo-100 mt-1">Configure system preferences</p>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Configure application settings and preferences.</p>
        </CardContent>
      </Card>
    </div>
  );
}
