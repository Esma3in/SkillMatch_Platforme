import React from 'react';
import PropTypes from 'prop-types';
import { Footer } from '../components/common/footer';
import NavbarCandidate from '../components/common/navbarCandidate';

const Certificate = ({
  recipientName = 'Jane Doe',
  courseTitle = 'Advanced React Development',
  date = 'May 21, 2025',
  issuer = 'xAI Academy'
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarCandidate />

      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-12 sm:py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Roboto', sans-serif" }}>
            Your Certificate of Achievement
          </h1>
          <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
            Celebrate your accomplishment with a professionally designed certificate from {issuer}.
          </p>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">About Your Certificate</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4">
            This certificate signifies your successful completion of {courseTitle}. It’s a testament to your dedication and skills, ready to be shared with employers, colleagues, or on social media. Each certificate is uniquely generated and verifiable through our platform.
          </p>
          <p className="text-base sm:text-lg text-gray-600">
            Use the options below to download your certificate as a PDF or share it directly to your professional networks.
          </p>
        </div>
      </section>

      {/* Certificate Display */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full bg-white border-8 border-indigo-600 shadow-2xl p-8 sm:p-12 rounded-lg bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h1v1H0z%22 fill=%22%23e0e7ff%22/%3E%3C/svg%3E')]">
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-600 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-indigo-600 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-600 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-indigo-600 rounded-br-lg" />

            {/* Certificate Content */}
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                  xAI
                </div>
              </div>
              <h2
                className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight"
                style={{ fontFamily: "'Great Vibes', cursive" }}
                aria-label="Certificate of Achievement"
              >
                Certificate of Achievement
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 font-medium">This is to certify that</p>
              <h3 className="text-2xl sm:text-3xl font-semibold text-indigo-800 mb-6">{recipientName}</h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 font-medium">has successfully completed</p>
              <h4 className="text-xl sm:text-2xl font-medium text-gray-800 mb-6">{courseTitle}</h4>
              <p className="text-base sm:text-lg text-gray-600 mb-4 font-medium">on</p>
              <p className="text-base sm:text-lg text-gray-600 mb-8">{date}</p>
              <div className="flex flex-col sm:flex-row justify-between w-full max-w-md mt-8 gap-4">
                <div>
                  <p className="text-lg text-gray-600 border-t-2 border-indigo-600 pt-1">{issuer}</p>
                  <p className="text-sm text-gray-500">Issuer</p>
                </div>
                <div>
                  <p className="text-lg text-gray-600 border-t-2 border-indigo-600 pt-1">Signature</p>
                  <p className="text-sm text-gray-500">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              aria-label="Download certificate as PDF"
            >
              Download PDF
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              aria-label="Share certificate on social media"
            >
              Share Certificate
            </button>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">How can I verify my certificate?</h3>
              <p className="text-base sm:text-lg text-gray-600">
                Each certificate comes with a unique verification code. Visit our verification page and enter the code to confirm authenticity.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Can I share my certificate?</h3>
              <p className="text-base sm:text-lg text-gray-600">
                Yes! Use the "Share Certificate" button to post your achievement on LinkedIn, Twitter, or other platforms.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Is the certificate downloadable?</h3>
              <p className="text-base sm:text-lg text-gray-600">
                Absolutely. Click the "Download PDF" button to save a high-quality PDF version of your certificate.
              </p>
            </div>
          </div>
        </div>
      </section>

 

      <Footer />
    </div>
  );
};

Certificate.propTypes = {
  recipientName: PropTypes.string,
  courseTitle: PropTypes.string,
  date: PropTypes.string,
  issuer: PropTypes.string
};

export default Certificate;