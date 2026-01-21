import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Users, Plus, Search, Pencil, Trash2, UserCheck, UserX, Shield, Eye, EyeOff, Send, Save, XCircle, Mail, Key } from "lucide-react";
import { useApp } from "@/contexts/AppContext.jsx";
import { useState } from "react";
import { toast } from "sonner";

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser, t } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [actionUser, setActionUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "user",
    status: "active",
    lastLogin: new Date().toISOString(),
  });

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <Badge className="bg-purple-500 hover:bg-purple-600 font-bold">{t('admin')}</Badge>;
      case 'user': return <Badge className="bg-blue-500 hover:bg-blue-600 font-bold">{t('user')}</Badge>;
      case 'viewer': return <Badge variant="secondary" className="font-bold">{t('viewer')}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500 hover:bg-green-600 font-bold">{t('active')}</Badge>;
      case 'inactive': return <Badge variant="secondary" className="font-bold">{t('inactive')}</Badge>;
      case 'suspended': return <Badge variant="destructive" className="font-bold">{t('suspended')}</Badge>;
    }
  };

  const handleAddUser = () => {
    if (newUser.username && newUser.password && newUser.email) {
      addUser(newUser);
      setNewUser({
        username: "",
        password: "",
        email: "",
        role: "user",
        status: "active",
        lastLogin: new Date().toISOString(),
      });
      setIsAddDialogOpen(false);
      setShowPassword(false);
    }
  };

  const handleEditUser = () => {
    if (editingUser) {
      updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      setIsEditDialogOpen(false);
      setShowEditPassword(false);
    }
  };

  const handleDeleteUser = (id) => {
    if (confirm(t('confirmDelete'))) {
      deleteUser(id);
    }
  };

  const handleOpenEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleOpenAction = (user) => {
    setActionUser(user);
    setIsActionDialogOpen(true);
  };

  const handleSendAction = () => {
    if (actionUser) {
      toast.success(`Action sent to: ${actionUser.email}`);
      setIsActionDialogOpen(false);
      setActionUser(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold drop-shadow-md">{t('userManagement')}</h1>
            <p className="text-violet-200 mt-1">{t('manageUsers')}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs text-muted-foreground">{t('totalUsers')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-xs text-muted-foreground">{t('active')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-xs text-muted-foreground">{t('admins')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <UserX className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'inactive').length}</p>
              <p className="text-xs text-muted-foreground">{t('inactive')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('totalUsers')} ({filteredUsers.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('search') + '...'}
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    {t('addUser')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      <Plus className="h-5 w-5 text-violet-600" />
                      {t('addUser')}
                    </DialogTitle>
                    <DialogDescription>Create a new user account that can login to the system</DialogDescription>
                  </DialogHeader>
                  <Separator />
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="font-bold">{t('username')}</Label>
                      <Input
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder={t('enterUsername')}
                        className="font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">{t('password')}</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder={t('enterPassword')}
                          className="pr-10 font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">{t('email')}</Label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="user@example.com"
                        className="font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">{t('role')}</Label>
                        <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                          <SelectTrigger className="font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{t('admin')}</SelectItem>
                            <SelectItem value="user">{t('user')}</SelectItem>
                            <SelectItem value="viewer">{t('viewer')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">{t('status')}</Label>
                        <Select value={newUser.status} onValueChange={(v) => setNewUser({ ...newUser, status: v })}>
                          <SelectTrigger className="font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">{t('active')}</SelectItem>
                            <SelectItem value="inactive">{t('inactive')}</SelectItem>
                            <SelectItem value="suspended">{t('suspended')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <DialogFooter className="gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="gap-2">
                      <XCircle className="h-4 w-4" />
                      {t('cancel')}
                    </Button>
                    <Button onClick={handleAddUser} disabled={!newUser.username || !newUser.password || !newUser.email} className="gap-2 bg-violet-600 hover:bg-violet-700">
                      <Save className="h-4 w-4" />
                      {t('add')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 h-10">
                  <TableHead className="py-2 font-bold">{t('username')}</TableHead>
                  <TableHead className="py-2 font-bold">{t('email')}</TableHead>
                  <TableHead className="py-2 font-bold">{t('role')}</TableHead>
                  <TableHead className="py-2 font-bold">{t('status')}</TableHead>
                  <TableHead className="py-2 font-bold">{t('lastLogin')}</TableHead>
                  <TableHead className="py-2 font-bold">{t('created')}</TableHead>
                  <TableHead className="py-2 text-center font-bold w-40">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="h-10 hover:bg-muted/30">
                      <TableCell className="py-1.5 font-bold text-slate-800">{user.username}</TableCell>
                      <TableCell className="py-1.5 font-semibold">{user.email}</TableCell>
                      <TableCell className="py-1.5">{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="py-1.5">{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="py-1.5 font-semibold">{formatDate(user.lastLogin)}</TableCell>
                      <TableCell className="py-1.5 font-semibold">{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="py-1.5">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 px-2 gap-1 text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={() => handleOpenAction(user)}
                          >
                            <Send className="h-3 w-3" />
                            Action
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 px-2 gap-1 text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                            onClick={() => handleOpenEdit(user)}
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 px-2 gap-1 text-xs border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Pencil className="h-5 w-5 text-emerald-600" />
              {t('editUser')}
            </DialogTitle>
            <DialogDescription>Update user information and credentials</DialogDescription>
          </DialogHeader>
          <Separator />
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">User ID</Label>
                    <p className="font-bold text-slate-800">{editingUser.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('created')}</Label>
                    <p className="font-bold text-slate-800">{formatDate(editingUser.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">{t('username')}</Label>
                <Input
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">{t('password')}</Label>
                <div className="relative">
                  <Input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="pr-10 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">{t('email')}</Label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">{t('role')}</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(v) => setEditingUser({ ...editingUser, role: v })}
                  >
                    <SelectTrigger className="font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t('admin')}</SelectItem>
                      <SelectItem value="user">{t('user')}</SelectItem>
                      <SelectItem value="viewer">{t('viewer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">{t('status')}</Label>
                  <Select
                    value={editingUser.status}
                    onValueChange={(v) => setEditingUser({ ...editingUser, status: v })}
                  >
                    <SelectTrigger className="font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('active')}</SelectItem>
                      <SelectItem value="inactive">{t('inactive')}</SelectItem>
                      <SelectItem value="suspended">{t('suspended')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <Separator />
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="gap-2">
              <XCircle className="h-4 w-4" />
              {t('cancel')}
            </Button>
            <Button onClick={handleEditUser} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Save className="h-4 w-4" />
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              User Action
            </DialogTitle>
            <DialogDescription>Send a notification or perform an action for this user</DialogDescription>
          </DialogHeader>
          <Separator />
          {actionUser && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('username')}</Label>
                    <p className="font-bold text-slate-800">{actionUser.username}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('role')}</Label>
                    <p className="font-bold">{getRoleBadge(actionUser.role)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('email')}</Label>
                    <p className="font-bold text-slate-800">{actionUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('status')}</Label>
                    <p className="font-bold">{getStatusBadge(actionUser.status)}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Action Type</Label>
                <Select defaultValue="email">
                  <SelectTrigger className="font-semibold">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> Send Email</span>
                    </SelectItem>
                    <SelectItem value="reset">
                      <span className="flex items-center gap-2"><Key className="h-4 w-4" /> Reset Password</span>
                    </SelectItem>
                    <SelectItem value="suspend">
                      <span className="flex items-center gap-2"><UserX className="h-4 w-4" /> Suspend Account</span>
                    </SelectItem>
                    <SelectItem value="activate">
                      <span className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Activate Account</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Message (Optional)</Label>
                <Input placeholder="Add any additional notes..." className="font-semibold" />
              </div>
            </div>
          )}
          <Separator />
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => { setIsActionDialogOpen(false); setActionUser(null); }} className="gap-2">
              <XCircle className="h-4 w-4" />
              {t('cancel')}
            </Button>
            <Button onClick={handleSendAction} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
              Send Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
