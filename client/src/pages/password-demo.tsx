import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { Key, Shield, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PasswordDemo() {
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [showPasswords, setShowPasswords] = useState({ login: false, register: false });
  const [loginResult, setLoginResult] = useState<any>(null);
  const [registerResult, setRegisterResult] = useState<any>(null);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setLoginResult({ success: true, data });
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.username}!`,
      });
    },
    onError: (error: any) => {
      setLoginResult({ success: false, error: error.message });
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: typeof registerForm) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setRegisterResult({ success: true, data });
      toast({
        title: "Registration Successful",
        description: `Account created for ${registerForm.username}`,
      });
      // Clear form
      setRegisterForm({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      });
    },
    onError: (error: any) => {
      setRegisterResult({ success: false, error: error.message });
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.username || !registerForm.password || !registerForm.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(registerForm);
  };

  const fillDemoLogin = (username: string, password: string) => {
    setLoginForm({ username, password });
    setLoginResult(null);
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRegisterForm(prev => ({ ...prev, password }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Password Authentication Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test user login and registration with secure password handling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Test User Login
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Demo Users */}
              <div>
                <h4 className="font-medium mb-3">Available Demo Users:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">testuser123</div>
                      <div className="text-sm text-gray-500">Password: testpassword123</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fillDemoLogin('testuser123', 'testpassword123')}
                    >
                      Use
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">sarah.admin</div>
                      <div className="text-sm text-gray-500">Password: admin123456</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fillDemoLogin('sarah.admin', 'admin123456')}
                    >
                      Use
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">mohamed.user</div>
                      <div className="text-sm text-gray-500">Password: userpass123</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fillDemoLogin('mohamed.user', 'userpass123')}
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="loginUsername">Username</Label>
                  <Input
                    id="loginUsername"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label htmlFor="loginPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPasswords.login ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, login: !prev.login }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPasswords.login ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loginMutation.isPending ? 'Logging in...' : 'Test Login'}
                </Button>
              </form>

              {/* Login Result */}
              {loginResult && (
                <div className={`p-4 rounded-lg ${
                  loginResult.success 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {loginResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {loginResult.success ? 'Login Successful' : 'Login Failed'}
                    </span>
                  </div>
                  {loginResult.success ? (
                    <div className="text-sm text-green-700 dark:text-green-300">
                      User ID: {loginResult.data.user.id}<br/>
                      Username: {loginResult.data.user.username}
                    </div>
                  ) : (
                    <div className="text-sm text-red-700 dark:text-red-300">
                      {loginResult.error}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Create New User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="regUsername">Username</Label>
                  <Input
                    id="regUsername"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter unique username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="regEmail">Email</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="regPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="regPassword"
                      type={showPasswords.register ? "text" : "password"}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter secure password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, register: !prev.register }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPasswords.register ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateStrongPassword}
                    className="mt-2"
                  >
                    Generate Strong Password
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              {/* Register Result */}
              {registerResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                  registerResult.success 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {registerResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {registerResult.success ? 'Account Created' : 'Registration Failed'}
                    </span>
                  </div>
                  {registerResult.success ? (
                    <div className="text-sm text-green-700 dark:text-green-300">
                      User ID: {registerResult.data.user.id}<br/>
                      Username: {registerResult.data.user.username}
                    </div>
                  ) : (
                    <div className="text-sm text-red-700 dark:text-red-300">
                      {registerResult.error}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Password Security Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Password Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Secure Hashing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All passwords are hashed with bcrypt and salt for maximum security
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Session Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  HTTP-only cookies with secure session management
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Key className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Password Validation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Minimum length requirements with strength recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}