import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Book, Video, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Help() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    {
      title: "Getting Started",
      icon: Book,
      articles: [
        "How to create your account",
        "Setting up your profile",
        "Verifying your identity",
        "First deposit guide"
      ]
    },
    {
      title: "Account Management",
      icon: FileText,
      articles: [
        "Updating personal information",
        "Password and security settings",
        "Two-factor authentication",
        "Account verification process"
      ]
    },
    {
      title: "Transactions",
      icon: Video,
      articles: [
        "How to send money",
        "Receiving payments",
        "Transaction limits and fees",
        "Understanding transaction history"
      ]
    },
    {
      title: "Cards & wallet",
      icon: Book,
      articles: [
        "Applying for a card",
        "Card activation and usage",
        "Bank transfers and limits",
        "International transactions"
      ]
    }
  ];

  const faqs = [
    {
      question: "How long does account verification take?",
      answer: "Account verification typically takes 1-3 business days. You'll receive an email notification once your account is verified."
    },
    {
      question: "What are the transaction limits?",
      answer: "Daily limits vary by account type: Basic accounts have a $1,000 daily limit, while Premium accounts have a $10,000 daily limit."
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email, and follow the instructions in the reset email."
    },
    {
      question: "Are there fees for international transfers?",
      answer: "International transfers have a 2% fee with a minimum of $5. Exchange rates are updated in real-time."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us through live chat, email (support@bankapp.com), or phone (+1-800-BANK-HELP) 24/7."
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-red-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/services")}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Help Center
          </h1>
        </div>

        {/* Search */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Icon className="h-5 w-5" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <button className="text-left w-full p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                          {article}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                    {expandedFAQ === index ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Can't find what you're looking for? Our support team is available 24/7 to help you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => setLocation("/support")}
                className="bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-red-800"
              >
                Contact Support
              </Button>
              <Button variant="outline">
                Schedule a Call
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}