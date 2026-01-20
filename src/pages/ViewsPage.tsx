import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";

export default function ViewsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <LayoutGrid className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md">Views</h1>
            <p className="text-sky-100 mt-1">Custom dashboard views and layouts</p>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Custom Views</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Create and manage custom dashboard views here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
