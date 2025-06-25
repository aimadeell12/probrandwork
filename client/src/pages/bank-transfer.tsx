import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building2, Check, Copy, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Bank } from "@shared/schema";

export default function BankTransfer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState("");

  // Get user data to check country
  const { data: userData } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: () => apiRequest("/api/auth/user").then(res => res.json())
  });

  // Get banks from database based on user's country
  const { data: banks, isLoading: isLoadingBanks } = useQuery<Bank[]>({
    queryKey: ["/api/banks", userData?.country],
    queryFn: async () => {
      const country = userData?.country;
      const url = country ? `/api/banks?country=${country}` : "/api/banks";
      console.log("🔄 Fetching banks from:", url);
      const response = await apiRequest("GET", url);
      const result = await response.json();
      console.log("📦 Received banks:", result);
      return result;
    },
    enabled: !!userData,
  });

  const availableBanks = banks || [];
  
  console.log("🏦 User country:", userData?.country);
  console.log("🏦 Available banks:", availableBanks);
  console.log("🏦 Banks loading:", isLoadingBanks);

  const selectedBankDetails = availableBanks.find((bank) => bank.code === selectedBank);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedBank) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transfer Created",
      description: "Bank transfer request created successfully. Use the details below to complete the transfer.",
    });
    setAmount("");
    setSelectedBank("");
    setReference("");
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
    toast({
      title: "Copied",
      description: "Information copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-purple-100 text-gray-700"
            onClick={() => setLocation("/deposit")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Building2 className="mr-3 h-6 w-6 text-purple-600" />
              Bank Transfer
            </h1>
            <p className="text-sm text-gray-600">
              Select bank and enter amount to create transfer request
            </p>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Create Bank Transfer Request</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700 text-sm">
                Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl font-bold text-center border-gray-200 focus:border-purple-500 rounded-lg h-12"
                min="1"
                step="0.01"
                required
              />
            </div>

            {/* Bank Selection */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-sm">Select Bank</Label>
              {availableBanks.length === 0 ? (
                <div className="p-6 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Building2 className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium mb-1">
                    No banks available for your country currently
                  </p>
                  <p className="text-gray-400 text-sm">
                    Available banks: Morocco (CIH, ATTIJARI, SGM)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableBanks.map((bank) => (
                    <div
                      key={bank.code}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedBank === bank.code
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 bg-white hover:border-purple-300"
                      }`}
                      onClick={() => setSelectedBank(bank.code)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                          {bank.logoUrl ? (
                            <img 
                              src={bank.logoUrl} 
                              alt={bank.nameEn}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {bank.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {bank.nameEn}
                          </p>
                        </div>
                        {selectedBank === bank.code && (
                          <Check className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reference (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="reference" className="text-gray-700 text-sm">
                Transfer Reference (Optional)
              </Label>
              <Textarea
                id="reference"
                placeholder="Enter reference or note for transfer"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="border-gray-200 focus:border-purple-500 rounded-lg text-sm"
                rows={2}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!amount || !selectedBank}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-base font-medium mt-4"
            >
              Create Transfer Request
            </Button>
          </form>
        </div>

        {/* Bank Details Card - Show when bank is selected */}
        {selectedBank && selectedBankDetails && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Selected Bank Details</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-10 h-10 flex items-center justify-center">
                  {selectedBankDetails.logoUrl ? (
                    <img 
                      src={selectedBankDetails.logoUrl} 
                      alt={selectedBankDetails.nameEn}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">
                    {selectedBankDetails.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {selectedBankDetails.nameEn}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">Account Number:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs">{selectedBankDetails.accountNumber}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => copyToClipboard(selectedBankDetails.accountNumber, 'account')}
                    >
                      {copied === 'account' ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">IBAN:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs">{selectedBankDetails.iban}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => copyToClipboard(selectedBankDetails.iban, 'iban')}
                    >
                      {copied === 'iban' ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">Swift Code:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs">{selectedBankDetails.swiftCode}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => copyToClipboard(selectedBankDetails.swiftCode, 'swift')}
                    >
                      {copied === 'swift' ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">Currency:</span>
                  <span className="font-medium text-sm">{selectedBankDetails.currency}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Card */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <h3 className="text-base font-bold text-purple-900 mb-3">
            Transfer Instructions
          </h3>
          <div className="space-y-2 text-purple-800">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</div>
              <p className="text-sm">Select the appropriate bank from the list above</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</div>
              <p className="text-sm">Enter the amount you want to transfer</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</div>
              <p className="text-sm">Click "Create Transfer Request" to get bank details</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">4</div>
              <p className="text-sm">Use the displayed bank details to make the transfer from your bank</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}