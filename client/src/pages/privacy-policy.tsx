import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5 relative pb-20 overflow-y-visible">
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
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-2xl prose prose-sm dark:prose-invert">
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          
          {/* Last Updated */}
          <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg p-4">
            <p className="text-sm text-primary dark:text-primary">
              <strong>Last Updated:</strong> December 2024
            </p>
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
            <p className="text-sm leading-relaxed">
              LM WORK MA, developed by LMWORK MA LIMITED ("we," "us," "our," or "Company"), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">A. Personal Information You Provide</h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Full name and email address</li>
              <li>Phone number</li>
              <li>Account credentials and passwords</li>
              <li>Identification documents for verification purposes</li>
              <li>Payment card information and bank account details</li>
              <li>Home address and date of birth</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">B. Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Device information (type, model, operating system version, unique device identifiers)</li>
              <li>Usage data (features accessed, pages visited, time spent, click patterns)</li>
              <li>Location information (only with your explicit permission)</li>
              <li>IP address and network information</li>
              <li>Browser type and version</li>
              <li>Crash logs and error reports</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">C. Permissions We Request</h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li><strong>Location:</strong> To provide location-based services and transaction processing</li>
              <li><strong>Camera:</strong> To capture identification documents for account verification</li>
              <li><strong>Contacts:</strong> To help you identify and contact other users (optional)</li>
              <li><strong>Storage:</strong> To save transaction receipts and account information locally</li>
              <li><strong>Network:</strong> To process transactions and communicate with our servers</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed mb-2">We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Providing and maintaining wallet and payment services</li>
              <li>Processing transactions and payments securely</li>
              <li>Verifying your identity and preventing fraud</li>
              <li>Complying with legal, tax, and regulatory requirements</li>
              <li>Improving our services and user experience</li>
              <li>Sending transactional notifications and security alerts</li>
              <li>Responding to your inquiries and customer support requests</li>
              <li>Analyzing usage patterns to detect abuse</li>
              <li>Conducting anti-money laundering (AML) checks</li>
              <li>Protecting against unauthorized access and cyber attacks</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Data Security</h2>
            <p className="text-sm leading-relaxed">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 mt-2">
              <li>256-bit AES encryption for sensitive data in transit and at rest</li>
              <li>Secure HTTPS/TLS connections for all communications</li>
              <li>PCI DSS Level 1 compliance for payment card processing</li>
              <li>Secure servers with firewalls and intrusion detection</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Restricted access to personal information (principle of least privilege)</li>
              <li>Multi-factor authentication for account access</li>
              <li>Secure password storage using industry-standard hashing</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Sharing of Information */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Sharing of Information</h2>
            <p className="text-sm leading-relaxed">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 mt-2">
              <li>Payment processors and financial institutions (necessary for transactions)</li>
              <li>Service providers and vendors who assist us in operating the app</li>
              <li>Law enforcement and regulatory authorities (when required by law)</li>
              <li>Banks and payment networks for transaction processing</li>
              <li>Fraud prevention and identity verification services</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              <strong>We do not sell, rent, or share your personal information with third parties for marketing purposes.</strong> We do not share your information without your consent, except where required by law.
            </p>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Your Privacy Rights</h2>
            <p className="text-sm leading-relaxed mb-2">Depending on your location, you have the following rights:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Right to access your personal information</li>
              <li>Right to correct or update inaccurate information</li>
              <li>Right to delete your account and associated data</li>
              <li>Right to opt-out of marketing communications</li>
              <li>Right to download your data in a portable format</li>
              <li>Right to lodge a complaint with data protection authorities</li>
              <li>Right to withdraw consent for data processing</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              To exercise these rights, please contact us using the information in the "Contact Us" section.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Cookies and Tracking Technologies</h2>
            <p className="text-sm leading-relaxed">
              We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze usage patterns. You can control cookie settings through your device or app settings. Some features may not function properly if you disable cookies.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Children's Privacy</h2>
            <p className="text-sm leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware of personal information collected from a child, we will immediately delete such information and take appropriate actions.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">9. Third-Party Services</h2>
            <p className="text-sm leading-relaxed">
              Our app may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing personal information.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">10. Data Retention</h2>
            <p className="text-sm leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Transaction records are retained according to financial regulations. You may request deletion of your data at any time, subject to legal and regulatory requirements.
            </p>
          </section>

          {/* International Data Transfer */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">11. International Data Transfer</h2>
            <p className="text-sm leading-relaxed">
              Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws different from your home country. By using LM WORK MA, you consent to such transfers. We ensure appropriate safeguards are in place for all international transfers.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">12. Changes to This Privacy Policy</h2>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last Updated" date and posting the revised policy on our app. Your continued use of LM WORK MA following the posting of changes means you accept the updated policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">13. Contact Us</h2>
            <p className="text-sm leading-relaxed mb-4">
              If you have questions about this Privacy Policy, our privacy practices, or wish to exercise your privacy rights, please contact us:
            </p>
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg p-4 text-sm mt-3 space-y-3">
              <div className="flex flex-col gap-1">
                <strong className="text-gray-900 dark:text-white">Developer:</strong>
                <p className="text-gray-700 dark:text-gray-300 ml-2">LMWORK MA LIMITED</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-gray-900 dark:text-white">Email:</strong>
                <p className="text-gray-700 dark:text-gray-300 ml-2">Contact@brandsoftapps.com</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-gray-900 dark:text-white">Phone:</strong>
                <p className="text-gray-700 dark:text-gray-300 ml-2">+(785) 915 9048</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-gray-900 dark:text-white">Address:</strong>
                <address className="text-gray-700 dark:text-gray-300 ml-2 not-italic">
                  2 Frederick Street, Kings Cross<br />
                  LONDON - WC1X 0ND<br />
                  United Kingdom (GB)
                </address>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-gray-900 dark:text-white">App Name:</strong>
                <p className="text-gray-700 dark:text-gray-300 ml-2">LM WORK MA</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-gray-900 dark:text-white">Response Time:</strong>
                <p className="text-gray-700 dark:text-gray-300 ml-2">We will respond to privacy inquiries within 30 days</p>
              </div>
            </div>
          </section>

          {/* Legal Compliance */}
          <section className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/50 rounded-lg p-4 mt-6">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">Legal Compliance</h3>
            <p className="text-sm text-yellow-900 dark:text-yellow-200">
              This Privacy Policy complies with applicable data protection regulations including GDPR, CCPA, HIPAA, and other international privacy laws. LM WORK MA operates in compliance with app store privacy requirements and financial services regulations. By using LM WORK MA, you acknowledge that you have read and agree to this Privacy Policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
