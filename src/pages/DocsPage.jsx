import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { BookOpen } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md">Documentation</h1>
            <p className="text-emerald-100 mt-1">System guides and help resources</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50">
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Login</h4>
                <p className="text-sm text-muted-foreground">Username: <code className="bg-muted px-2 py-1 rounded">Admin</code></p>
                <p className="text-sm text-muted-foreground">Password: <code className="bg-muted px-2 py-1 rounded">Admin@1881</code></p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Navigation</h4>
                <p className="text-sm text-muted-foreground">Use the ribbon tabs to access different modules</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Search</h4>
                <p className="text-sm text-muted-foreground">Global search bar filters data across all pages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Multi-edit: Select multiple rows and edit together</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Expandable rows: Click chevron to view details</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Export: Download data as CSV or Excel</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Visual Builder: Create pages with drag & drop (dev mode)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Multi-language: Switch between English and German</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle>Table Operations</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <div>
                <strong>Sorting:</strong> Click column headers to sort
              </div>
              <div>
                <strong>Filtering:</strong> Use status and priority dropdowns
              </div>
              <div>
                <strong>Search:</strong> Type in search box to find records
              </div>
              <div>
                <strong>Pagination:</strong> Use slider or prev/next buttons
              </div>
              <div>
                <strong>Multi-select:</strong> Check boxes to select multiple rows
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle>Environments</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm font-mono">
              <div>
                <Badge className="mb-2">Development</Badge>
                <div className="text-xs bg-muted p-2 rounded">npm run dev</div>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Test</Badge>
                <div className="text-xs bg-muted p-2 rounded">npm run dev:test</div>
              </div>
              <div>
                <Badge variant="destructive" className="mb-2">Production</Badge>
                <div className="text-xs bg-muted p-2 rounded">npm run build</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
