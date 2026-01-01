import { ArrowLeft, ShieldCheck, FileText, Search, UserCheck, Activity, BarChart, AlertTriangle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function AMLPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-red-900 dark:to-blue-900 relative overflow-hidden pb-20">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-red-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-red-200/30 dark:border-red-700/30 p-4 relative z-10 sticky top-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
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
          <div className="bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/50 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="h-6 w-6 text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-bold text-red-900 dark:text-red-100 m-0">Anti-Money Laundering Policy</h2>
            </div>
            <p className="text-sm text-red-900/80 dark:text-red-200/80 leading-relaxed m-0">
              PROBRANDIFY LIMITED has implemented and maintains a comprehensive Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) policy in accordance with applicable regulations and internationally recognized standards, including FATF recommendations.
            </p>
          </div>

          <div className="grid gap-6">
            {/* 1. KYC */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-red-600 dark:text-red-400">
                <UserCheck className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">1. KYC & Customer Due Diligence</h3>
              </div>
              <p className="text-sm leading-relaxed">
                All customers are subject to Know Your Customer (KYC) and Customer Due Diligence (CDD) procedures prior to onboarding. This includes identity verification using government-issued identification documents, proof of address verification, and beneficial ownership verification for corporate customers.
              </p>
            </section>

            {/* 2. EDD */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-red-600 dark:text-red-400">
                <Search className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">2. Enhanced Due Diligence (EDD)</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Enhanced Due Diligence is applied to higher-risk customers, jurisdictions, or activities. EDD measures may include additional documentation, source of funds information, senior management approval, and increased monitoring.
              </p>
            </section>

            {/* 3. Screening */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-red-600 dark:text-red-400">
                <FileText className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">3. Sanctions & PEP Screening</h3>
              </div>
              <p className="text-sm leading-relaxed">
                All customers are screened against applicable sanctions lists, including OFAC SDN and United Nations Security Council lists. Politically Exposed Persons (PEPs) and adverse media are identified and subject to enhanced review.
              </p>
            </section>

            {/* 4. Monitoring */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-red-600 dark:text-red-400">
                <Activity className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">4. Transaction Monitoring</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Transactions are monitored on an ongoing basis using rule-based controls to identify suspicious or unusual activity, including volume velocity anomalies and geographic risk indicators.
              </p>
            </section>

            {/* 5. Periodic Review */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-red-600 dark:text-red-400">
                <BarChart className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">5. Ongoing Monitoring</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Customer relationships are subject to periodic review based on a risk-based approach. Customer information is updated periodically and upon the occurrence of trigger events.
              </p>
            </section>

            {/* 6. Reporting */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">6. Reporting & Escalation</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Suspicious activities are escalated internally and, where required, reported to the relevant authorities in accordance with applicable laws and regulations.
              </p>
            </section>

            {/* 7. Scope */}
            <section className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-3 text-red-600 dark:text-red-400">
                <CreditCard className="h-5 w-5" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">7. Scope of Services</h3>
              </div>
              <p className="text-sm leading-relaxed">
                PROBRANDIFY LIMITED provides virtual and physical card issuing services. The company does not support cryptocurrency or blockchain-based transactions.
              </p>
            </section>
          </div>

          {/* Compliance Notice */}
          <section className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/50 rounded-lg p-4 mt-6">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2 m-0">Compliance Acknowledgement</h3>
            <p className="text-sm text-yellow-900 dark:text-yellow-200 m-0">
              By using our services, you acknowledge that you are subject to the AML/CTF framework described above. Failure to comply with documentation requests may result in account suspension or termination.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
