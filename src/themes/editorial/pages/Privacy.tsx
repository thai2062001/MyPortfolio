import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Editorial.css';

const Privacy: React.FC = () => {
  return (
    <div className="editorial-theme" style={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>
      <Header />
      
      <main className="editorial-section" style={{ padding: '160px 20px 100px' }}>
        <div className="editorial-container" style={{ maxWidth: '840px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="editorial-h2" style={{ textAlign: 'center', marginBottom: '16px' }}>Privacy Policy</h1>
            <p className="editorial-h4" style={{ textAlign: 'center', marginBottom: '80px', opacity: 0.6 }}>Last updated on 25 Jan 2025</p>

            <div className="privacy-content" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <section>
                <p className="editorial-body">
                  Welcome to Archio ("we" or "us"). This Privacy Policy is designed to help you understand how we collect, use, disclose, and safeguard your personal information when you use our website and related services.
                </p>
              </section>

              <section>
                <h3 className="editorial-h4" style={{ marginBottom: '16px' }}>1. Information We Collect</h3>
                <p className="editorial-body">
                  <strong>1.1 Personal Information:</strong> We may collect personal information, such as your name, email address, and other contact details when you voluntarily provide it to us, such as when you register for an account, subscribe to newsletters, or contact us through the website.
                </p>
                <p className="editorial-body" style={{ marginTop: '16px' }}>
                  <strong>1.2 Usage Information:</strong> We may collect information about your use of the website, including your IP address, browser type, device information, and pages visited. This information helps us analyze trends, administer the site, and improve user experience.
                </p>
              </section>

              <section>
                <h3 className="editorial-h4" style={{ marginBottom: '16px' }}>2. How We Use Your Information</h3>
                <p className="editorial-body">
                  We use the collected information for various purposes, including:
                </p>
                <ul className="editorial-body" style={{ marginTop: '16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Providing and maintaining the website</li>
                  <li>Communicating with you about your account and our services</li>
                  <li>Sending newsletters, promotional materials, and other information you request</li>
                  <li>Analyzing website usage and improving our services</li>
                </ul>
              </section>

              <section>
                <h3 className="editorial-h4" style={{ marginBottom: '16px' }}>3. Sharing Your Information</h3>
                <p className="editorial-body">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy. We may share information with trusted third-party service providers who assist us in operating our website or conducting our business.
                </p>
              </section>

              <section>
                <h3 className="editorial-h4" style={{ marginBottom: '16px' }}>4. Cookies and Similar Technologies</h3>
                <p className="editorial-body">
                  We use cookies and similar technologies to enhance your experience on our website. You can control cookies through your browser settings, but disabling them may affect your ability to use certain features of the site.
                </p>
              </section>

              <section>
                <h3 className="editorial-h4" style={{ marginBottom: '16px' }}>5. Your Choices</h3>
                <p className="editorial-body">
                  You can manage your communication preferences by unsubscribing from newsletters or adjusting your account settings. You may also contact us to update or delete your personal information.
                </p>
              </section>

              <section>
                <h3 className="editorial-h4" style={{ marginBottom: '16px' }}>6. Security</h3>
                <p className="editorial-body">
                  We take reasonable measures to protect the security of your personal information. However, no method of transmission over the internet or electronic storage is completely secure. Therefore, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h3 className="editorial-h4" style={{ marginBottom: '16px' }}>7. Children's Privacy</h3>
                <p className="editorial-body">
                  Our website is not directed to individuals under the age of 18. If you become aware that a child has provided us with personal information, please contact us, and we will take steps to remove such information.
                </p>
              </section>

              <section>
                <h3 className="editorial-h4" style={{ marginBottom: '16px' }}>8. Changes to This Privacy Policy</h3>
                <p className="editorial-body">
                  We may update this Privacy Policy periodically. We will notify you of any changes by posting the new Privacy Policy on this page. Your continued use of the website after such modifications will constitute your acknowledgment of the modified Privacy Policy.
                </p>
              </section>

              <section>
                <h3 className="editorial-h4" style={{ marginBottom: '16px' }}>9. Contact Us</h3>
                <p className="editorial-body">
                  If you have any questions about this Privacy Policy, please contact us at <a href="mailto:archio@mail.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>archio@mail.com</a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
