import { ArrowLeft, ShieldCheck, FileText, Search, UserCheck, Activity, BarChart, AlertTriangle, CreditCard, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function AMLPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5 relative overflow-y-visible pb-20">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-primary/10 to-primary/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-primary/20 dark:border-primary/30 p-4 relative z-10 sticky top-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2 hover:bg-primary/10 dark:hover:bg-primary/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            AML Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-2xl prose prose-sm dark:prose-invert">
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          
          {/* Overview */}
          <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="h-6 w-6 text-primary dark:text-primary" />
              <h2 className="text-lg font-bold text-primary dark:text-primary m-0">Anti-Money Laundering (AML) Policy</h2>
            </div>
            <p className="text-sm text-primary/80 dark:text-primary/80 leading-relaxed m-0 font-medium">
              BRAND APPS SOFTWARE COMPANY
            </p>
            <p className="text-sm text-primary/80 dark:text-primary/80 leading-relaxed mt-2 m-0">
              BRAND APPS SOFTWARE COMPANY is committed to preventing money laundering, terrorist financing, and other financial crimes. This policy outlines our commitment to compliance with applicable laws, regulations, and international best practices.
            </p>
          </div>

          <div className="grid gap-6">
            {/* 1. Scope */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary dark:text-red-400">
                <Globe className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">1. Scope of Application</h3>
              </div>
              <p className="text-sm leading-relaxed">
                This policy applies to all users, customers, partners, and activities conducted through the BRAND APPS SOFTWARE COMPANY platform, including card issuing services (virtual and physical cards) and issuing API services.
              </p>
            </section>

            {/* 2. Regulatory Commitment */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary dark:text-red-400">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">2. Regulatory Commitment</h3>
              </div>
              <p className="text-sm leading-relaxed">
                BRAND APPS SOFTWARE COMPANY operates in accordance with applicable AML, Counter-Terrorist Financing (CTF), and sanctions regulations, as well as international standards such as the Financial Action Task Force (FATF) recommendations.
              </p>
            </section>

            {/* 3. KYC */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary dark:text-red-400">
                <UserCheck className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">3. Customer Due Diligence (KYC)</h3>
              </div>
              <p className="text-sm leading-relaxed">
                We apply Know Your Customer (KYC) procedures to verify identity prior to onboarding:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2 mt-2">
                <li>Identity verification</li>
                <li>Verification of beneficial ownership</li>
                <li>Risk-based customer assessment</li>
                <li>Enhanced Due Diligence (EDD) for high-risk customers</li>
              </ul>
            </section>

            {/* 4. Screening */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary dark:text-red-400">
                <Search className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">4. Sanctions & PEP Screening</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Customers are screened against applicable sanctions lists, politically exposed persons (PEP) databases, and other relevant watchlists at onboarding and on an ongoing basis.
              </p>
            </section>

            {/* 5. Monitoring */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary dark:text-red-400">
                <Activity className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">5. Transaction Monitoring</h3>
              </div>
              <p className="text-sm leading-relaxed">
                We apply risk-based transaction monitoring controls designed to identify unusual or suspicious card transaction activity. Appropriate action is taken where potential risks are identified.
              </p>
            </section>

            {/* 6. Prohibited Activities */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary dark:text-red-400">
                <Lock className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">6. Prohibited Activities</h3>
              </div>
              <p className="text-sm leading-relaxed">
                The platform must not be used for unlawful purposes, including money laundering, terrorist financing, or activities involving sanctioned jurisdictions or individuals.
              </p>
            </section>

            {/* 7. Record Keeping */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary dark:text-red-400">
                <FileText className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">7. Record Keeping</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Customer and transaction records are maintained in accordance with applicable legal and regulatory requirements.
              </p>
            </section>

            {/* 8. Reporting */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-primary dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">8. Reporting & Cooperation</h3>
              </div>
              <p className="text-sm leading-relaxed">
                BRAND APPS SOFTWARE COMPANY cooperates with competent authorities and relevant financial partners when required by law.
              </p>
            </section>
          </div>

          {/* Footer Info */}
          <section className="bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-6 text-xs space-y-2">
            <p><strong>Last Updated:</strong> 2025</p>
            <p><strong>Company:</strong> BRAND APPS SOFTWARE COMPANY</p>
            <p><strong>Jurisdiction:</strong> USA</p>
          </section>

        </div>
      </div>
    </div>
  );
}
