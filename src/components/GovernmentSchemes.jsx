import { Link } from 'react-router-dom';
import { ArrowLeft, Building, Users, Tractor, Droplets, ArrowRight, Leaf } from 'lucide-react';

const schemes = [
  {
    id: 1,
    title: 'PM-KISAN',
    description: 'Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6,000 per year to farmer families.',
    eligibility: 'All landholding farmer families with cultivable land.',
    icon: Building,
    link: 'https://pmkisan.gov.in',
  },
  {
    id: 2,
    title: 'PMFBY',
    description: 'Pradhan Mantri Fasal Bima Yojana provides crop insurance at very low premium rates.',
    eligibility: 'All farmer families including sharecropers and tenant farmers.',
    icon: Leaf,
    link: 'https://pmfby.gov.in',
  },
  {
    id: 3,
    title: 'Kisan Credit Card',
    description: 'Easy credit for farmers at concessional interest rates for agricultural needs.',
    eligibility: 'All farmers - individual/joint borrowers who are owner cultivators.',
    icon: Droplets,
    link: 'https://www.pmjdy.gov.in/scheme/kisan-credit-card-scheme',
  },
  {
    id: 4,
    title: 'Fasal Insurance Scheme',
    description: 'Crop insurance scheme to protect farmers against crop loss due to natural calamities.',
    eligibility: 'All farmers including sharecropers and tenant farmers.',
    icon: Leaf,
    link: '#',
  },
  {
    id: 5,
    title: 'Agricultural Infrastructure Fund',
    description: 'Financing facility for investment in agricultural infrastructure projects.',
    eligibility: 'Farmers, FPOs, PGs, and agri-entrepreneurs.',
    icon: Tractor,
    link: 'https://aif-mofpi.nic.in',
  },
  {
    id: 6,
    title: 'Sub-Mission on Agricultural Mechanization',
    description: 'Financial assistance for purchase of farm machinery and equipment.',
    location: 'Small and marginal farmers, women farmers, and farmers from SC/ST categories.',
    icon: Tractor,
    link: '#',
  },
];

const GovernmentSchemes = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Government Schemes
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Beneficial schemes and programs for Indian farmers
          </p>
        </div>
      </section>

      {/* Schemes Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#2E7D32]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <scheme.icon className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{scheme.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{scheme.description}</p>
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Eligibility</p>
                    <p className="text-sm text-gray-700">{scheme.eligibility}</p>
                  </div>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#2E7D32] font-semibold hover:text-[#1B5E20] transition-colors"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Note: This information is for reference only. Please visit the official government websites for the latest updates and application procedures.
          </p>
        </div>
      </section>
    </div>
  );
};

export default GovernmentSchemes;