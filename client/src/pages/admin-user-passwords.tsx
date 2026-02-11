import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Key, Users, Eye, EyeOff, RefreshCw, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  hasPassword: boolean;
}

export default function AdminUserPasswords() {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Fetch all users
  const { data: users = [], isLoading, refetch } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Successfully",
        description: `Password has been updated for the selected user`,
      });
      setNewPassword('');
      setSelectedUserId('');
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Reset Password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generatePasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/generate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to generate password');
      return response.json();
    },
    onSuccess: (data) => {
      setNewPassword(data.password);
      toast({
        title: "Password Generated",
        description: "Secure password has been generated. Copy it before resetting.",
      });
    },
  });

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !newPassword) {
      toast({
        title: "Missing Information",
        description: "Please select a user and enter a new password",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    resetPasswordMutation.mutate({ userId: selectedUserId, password: newPassword });
  };

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword(password);
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Password Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Reset and manage user passwords for the BrandSoft Pay platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedUserId === user.id
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            @{user.username} • {user.email}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.hasPassword ? "default" : "secondary"}>
                            {user.hasPassword ? "Has Password" : "No Password"}
                          </Badge>
                          {user.hasPassword && <Shield className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Reset Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Reset Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedUser ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a user to reset their password</p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                      Selected User
                    </h4>
                    <div className="text-sm text-red-700 dark:text-red-300">
                      <div><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</div>
                      <div><strong>Username:</strong> @{selectedUser.username}</div>
                      <div><strong>Email:</strong> {selectedUser.email}</div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 characters)"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateSecurePassword}
                      className="flex-1"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate Secure
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="w-full bg-primary hover:bg-red-700"
                  >
                    {resetPasswordMutation.isPending ? (
                      <>Resetting...</>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Reset Password
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Password Security Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Password Security Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Strong Password Requirements:</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Minimum 6 characters (8+ recommended)</li>
                  <li>• Mix of uppercase and lowercase letters</li>
                  <li>• Include numbers and special characters</li>
                  <li>• Avoid common words and personal info</li>
                  <li>• Don't reuse passwords from other accounts</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Direct Password Reset via API:</h4>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`curl -X POST /api/admin/reset-password \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "user-id-here",
    "password": "new-secure-password"
  }'`}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}