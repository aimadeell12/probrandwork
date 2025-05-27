import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  ArrowLeft, 
  Send, 
  Download,
  Plus,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Banknote,
  CreditCard,
  History
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { BankTransfer as BankTransferType } from "@shared/schema";

export default function BankTransfer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'incoming'>('send');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch bank transfers
  const { data: transfers = [], isLoading } = useQuery({
    queryKey: ["/api/bank-transfers"],
  });

  // Fetch user's bank accounts
  const { data: bankAccounts = [] } = useQuery({
    queryKey: ["/api/bank-accounts"],
  });

  const [transferForm, setTransferForm] = useState({
    amount: '',
    recipientName: '',
    recipientBank: '',
    recipientAccount: '',
    reference: '',
    description: '',
    currency: 'USD'
  });

  const createTransfer = useMutation({
    mutationFn: async (transferData: any) => {
      const response = await fetch('/api/bank-transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData),
      });
      if (!response.ok) throw new Error('Failed to create transfer');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Transfer Initiated",
        description: "Your bank transfer has been submitted for processing.",
      });
      setTransferForm({
        amount: '',
        recipientName: '',
        recipientBank: '',
        recipientAccount: '',
        reference: '',
        description: '',
        currency: 'USD'
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bank-transfers"] });
    },
  });

  const cancelTransfer = useMutation({
    mutationFn: async (transferId: string) => {
      const response = await fetch(`/api/bank-transfers/${transferId}/cancel`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to cancel transfer');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Transfer Cancelled",
        description: "The transfer has been successfully cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bank-transfers"] });
    },
  });

  const filteredTransfers = transfers.filter((transfer: BankTransfer) => {
    const matchesFilter = filter === 'all' || transfer.status === filter;
    const matchesSearch = transfer.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <AlertTriangle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleSubmitTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transferForm.amount || !transferForm.recipientName || !transferForm.recipientAccount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createTransfer.mutate({
      ...transferForm,
      amount: parseFloat(transferForm.amount),
      type: 'outgoing',
      status: 'pending',
      feeAmount: parseFloat(transferForm.amount) * 0.01, // 1% fee
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bank Transfer
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your bank transfers and payments
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'send' ? 'default' : 'outline'}
            onClick={() => setActiveTab('send')}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send Money
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Transfer History
          </Button>
          <Button
            variant={activeTab === 'incoming' ? 'default' : 'outline'}
            onClick={() => setActiveTab('incoming')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Incoming
          </Button>
        </div>

        {/* Send Money Tab */}
        {activeTab === 'send' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Bank Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTransfer} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        value={transferForm.amount}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={transferForm.currency} onValueChange={(value) => setTransferForm(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="MAD">MAD - Moroccan Dirham</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recipient Name */}
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name *</Label>
                    <Input
                      id="recipientName"
                      placeholder="Enter recipient full name"
                      value={transferForm.recipientName}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, recipientName: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Recipient Bank */}
                  <div className="space-y-2">
                    <Label htmlFor="recipientBank">Recipient Bank</Label>
                    <Input
                      id="recipientBank"
                      placeholder="Bank name"
                      value={transferForm.recipientBank}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, recipientBank: e.target.value }))}
                    />
                  </div>

                  {/* Account Number */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="recipientAccount">Account Number/IBAN *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="recipientAccount"
                        placeholder="Enter account number or IBAN"
                        value={transferForm.recipientAccount}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, recipientAccount: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Reference */}
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference</Label>
                    <Input
                      id="reference"
                      placeholder="Payment reference"
                      value={transferForm.reference}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, reference: e.target.value }))}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Purpose of transfer"
                      value={transferForm.description}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Fee Information */}
                {transferForm.amount && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-center text-sm">
                      <span>Transfer Amount:</span>
                      <span className="font-medium">${transferForm.amount} {transferForm.currency}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>Processing Fee (1%):</span>
                      <span className="font-medium">${(parseFloat(transferForm.amount || '0') * 0.01).toFixed(2)} {transferForm.currency}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-blue-200 dark:border-blue-700 font-semibold">
                      <span>Total Amount:</span>
                      <span>${(parseFloat(transferForm.amount || '0') * 1.01).toFixed(2)} {transferForm.currency}</span>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={createTransfer.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {createTransfer.isPending ? "Processing..." : "Send Transfer"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* History Tab */}
        {(activeTab === 'history' || activeTab === 'incoming') && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by recipient or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transfers</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transfer List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading transfers...</p>
                </div>
              ) : filteredTransfers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No transfers found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTransfers
                  .filter((transfer: BankTransfer) => activeTab === 'incoming' ? transfer.type === 'incoming' : transfer.type === 'outgoing')
                  .map((transfer: BankTransfer) => (
                    <Card key={transfer.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              {transfer.type === 'incoming' ? <Download className="h-5 w-5 text-blue-600" /> : <Send className="h-5 w-5 text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {transfer.type === 'incoming' ? transfer.senderName : transfer.recipientName}
                                </h3>
                                <Badge className={`text-xs ${getStatusColor(transfer.status)}`}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(transfer.status)}
                                    {transfer.status}
                                  </div>
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {transfer.type === 'incoming' ? transfer.senderBank : transfer.recipientBank}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {transfer.reference && `Ref: ${transfer.reference} • `}
                                {format(new Date(transfer.createdAt), 'MMM dd, yyyy HH:mm')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                            <div className="text-right">
                              <p className={`font-semibold ${transfer.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                                {transfer.type === 'incoming' ? '+' : '-'}${transfer.amount.toFixed(2)} {transfer.currency}
                              </p>
                              {transfer.feeAmount > 0 && (
                                <p className="text-xs text-gray-500">
                                  Fee: ${transfer.feeAmount.toFixed(2)}
                                </p>
                              )}
                            </div>
                            
                            {transfer.status === 'pending' && transfer.type === 'outgoing' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelTransfer.mutate(transfer.id)}
                                disabled={cancelTransfer.isPending}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}