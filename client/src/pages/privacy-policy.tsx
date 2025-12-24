import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden pb-20">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-purple-200/30 dark:border-purple-700/30 p-4 relative z-10 sticky top-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-2xl prose prose-sm dark:prose-invert">
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          
          {/* Last Updated */}
          <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>Last Updated:</strong> December 2024
            </p>
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
            <p className="text-sm leading-relaxed">
              Welcome to PROBRANDIFY ("we," "us," "our," or "Company"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, and other online services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">A. Personal Information You Provide</h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Name, email address, phone number</li>
              <li>Account credentials and identification documents</li>
              <li>Payment card information and bank account details</li>
              <li>Address and date of birth</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">B. Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Device information (type, operating system, unique identifiers)</li>
              <li>Usage data (features accessed, pages visited, time spent)</li>
              <li>Location information (with your permission)</li>
              <li>IP address and browser information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed mb-2">We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Providing and maintaining our wallet and payment services</li>
              <li>Processing transactions and payments</li>
              <li>Verifying your identity and preventing fraud</li>
              <li>Complying with legal and regulatory requirements</li>
              <li>Improving our services and user experience</li>
              <li>Sending transactional and promotional communications</li>
              <li>Responding to your inquiries and customer support requests</li>
              <li>Analyzing usage patterns and trends</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Data Security</h2>
            <p className="text-sm leading-relaxed">
              We implement comprehensive security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 mt-2">
              <li>256-bit encryption for sensitive data transmission</li>
              <li>Secure servers and firewalls</li>
              <li>Regular security audits and penetration testing</li>
              <li>Restricted access to personal information</li>
              <li>PCI DSS compliance for payment processing</li>
            </ul>
          </section>

          {/* Sharing of Information */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Sharing of Information</h2>
            <p className="text-sm leading-relaxed">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 mt-2">
              <li>Payment processors and financial institutions</li>
              <li>Service providers and contractors</li>
              <li>Law enforcement and regulatory authorities (when required by law)</li>
              <li>Business partners with your consent</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              We do not sell or rent your personal information to third parties.
            </p>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Your Privacy Rights</h2>
            <p className="text-sm leading-relaxed mb-2">You have the right to:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your information</li>
              <li>Lodge a complaint with regulatory authorities</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Cookies and Tracking Technologies</h2>
            <p className="text-sm leading-relaxed">
              We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze usage patterns. You can control cookie settings through your browser preferences.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Children's Privacy</h2>
            <p className="text-sm leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will promptly delete the information.
            </p>
          </section>

          {/* International Data Transfer */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">9. International Data Transfer</h2>
            <p className="text-sm leading-relaxed">
              Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country. By using PROBRANDIFY, you consent to such transfers.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">10. Data Retention</h2>
            <p className="text-sm leading-relaxed">
              We retain your personal information for as long as necessary to provide our services, comply with legal obligations, and resolve disputes. The retention period may vary depending on the type of information and its purpose.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">11. Third-Party Links</h2>
            <p className="text-sm leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing personal information.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">12. Changes to This Privacy Policy</h2>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last Updated" date and posting the revised policy on our platform. Your continued use of PROBRANDIFY following the posting of revised Privacy Policy means that you accept and agree to the changes.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">13. Contact Us</h2>
            <p className="text-sm leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/50 rounded-lg p-4 text-sm mt-3 space-y-3">
              <div className="flex flex-col gap-1">
                <strong className="text-gray-900 dark:text-white">Email:</strong>
                <p className="text-gray-700 dark:text-gray-300 ml-2">Support@probrandify.org</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-gray-900 dark:text-white">Phone:</strong>
                <p className="text-gray-700 dark:text-gray-300 ml-2">+19138024746</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-gray-900 dark:text-white">Address:</strong>
                <p className="text-gray-700 dark:text-gray-300 ml-2">PROBRANDIFY LLC</p>
              </div>
            </div>
          </section>

          {/* Compliance Notice */}
          <section className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/50 rounded-lg p-4 mt-6">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">Compliance Notice</h3>
            <p className="text-sm text-yellow-900 dark:text-yellow-200">
              This Privacy Policy complies with applicable data protection regulations including GDPR, CCPA, and other international privacy laws. By using PROBRANDIFY, you acknowledge that you have read and agree to this Privacy Policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
