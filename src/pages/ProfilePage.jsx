import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { User, Mail, Shield, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { Badge } from "@/components/ui/badge.jsx";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md">User Profile</h1>
            <p className="text-purple-100 mt-1">Manage your account settings</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Username</span>
              <span className="font-semibold">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-sm">{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Administrator</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-sky-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-sky-600" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Login</span>
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session</span>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
