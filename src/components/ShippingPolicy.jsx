import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, Package, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#2E7D32] font-semibold hover:text-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Shipping Policy
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Fast and reliable delivery for all your agricultural needs
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            
            {/* Order Processing */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2E7D32]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-[#2E7D32]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Order Processing</h2>
                  <p className="text-gray-600 leading-relaxed">
                    All orders are processed within <span className="font-semibold text-gray-900">1–2 working days</span> after order confirmation. 
                    We ensure thorough quality checks before dispatching any product to guarantee you receive only the best agricultural inputs.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2E7D32]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#2E7D32]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Delivery Time</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                      <MapPin className="w-5 h-5 text-[#2E7D32] flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Local Delivery</p>
                        <p className="text-sm text-gray-600">1–3 working days (Malkapur Pangra & surrounding areas)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                      <MapPin className="w-5 h-5 text-[#2E7D32] flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Other Areas</p>
                        <p className="text-sm text-gray-600">3–7 working days (across Maharashtra & India)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Updates */}
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2E7D32]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-[#2E7D32]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Order Updates & Tracking</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Once your order is dispatched, you will receive:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
                      <span>Order confirmation email/SMS</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
                      <span>Tracking number for real-time updates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
                      <span>Delivery status notifications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">
              For any shipping-related queries, feel free to contact us
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+919284518038" className="inline-flex items-center gap-2 text-[#2E7D32] font-medium hover:text-[#1B5E20]">
                <Phone className="w-4 h-4" />
                +91 92845 18038
              </a>
              <a href="mailto:gawandekrushikendra@gmail.com" className="inline-flex items-center gap-2 text-[#2E7D32] font-medium hover:text-[#1B5E20]">
                <Mail className="w-4 h-4" />
                gawandekrushikendra@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#2E7D32] to-[#388E3C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Have Questions About Shipping?
          </h2>
          <p className="text-green-100 mb-6">
            We're here to help ensure your products reach you on time
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-[#2E7D32] font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;