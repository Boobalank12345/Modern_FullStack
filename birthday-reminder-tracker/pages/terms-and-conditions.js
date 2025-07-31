import Head from 'next/head'
import Link from 'next/link'

export default function TermsConditions() {
  return (
    <>
      <Head>
        <title>Terms & Conditions - Birthday Reminder Tracker</title>
        <meta name="description" content="Terms and conditions for using Birthday Reminder Tracker" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing and using Birthday Reminder Tracker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-6">
                Birthday Reminder Tracker is a web application that allows users to track and receive reminders for birthdays of their contacts. The service includes features such as:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Adding and managing birthday information</li>
                <li>Setting custom reminder preferences</li>
                <li>Organizing contacts by relationship type</li>
                <li>Storing gift ideas and notes</li>
                <li>Viewing analytics and upcoming birthdays</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                We take your privacy seriously. By using our service, you agree that:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>We may collect and store personal information as described in our Privacy Policy</li>
                <li>You have the right to access, modify, or delete your personal data</li>
                <li>We implement appropriate security measures to protect your data</li>
                <li>We will not share your personal information with third parties without consent</li>
                <li>You are responsible for the accuracy of the birthday information you enter</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Upload malicious code or attempt to hack the system</li>
                <li>Spam or send unsolicited communications</li>
                <li>Store false or misleading information</li>
                <li>Use the service for commercial purposes without permission</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                The Service and its original content, features, and functionality are owned by Birthday Reminder Tracker and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of the birthday data you input into the system.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Service Availability</h2>
              <p className="text-gray-700 mb-6">
                We strive to maintain high availability of our service, but we do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues. We are not liable for any inconvenience caused by service interruptions.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                Birthday Reminder Tracker shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 mb-6">
                We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page. Your continued use of the service after such modifications constitutes acceptance of the updated terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-6">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which Birthday Reminder Tracker operates, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms & Conditions, please contact us through our support channels or by using the contact information provided in the application.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Questions?</h3>
                <p className="text-blue-800">
                  If you have any questions about these terms and conditions, please don't hesitate to contact our support team. We're here to help clarify any concerns you may have.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}