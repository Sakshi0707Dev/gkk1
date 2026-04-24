import { Link } from 'react-router-dom';
import { ArrowLeft, Image } from 'lucide-react';

const Gallery = () => {
  const images = [
    { id: 1, title: 'Seeds Collection', category: 'Seeds' },
    { id: 2, title: 'Fertilizers', category: 'Crop Nutrition' },
    { id: 3, title: 'Pesticides', category: 'Crop Protection' },
    { id: 4, title: 'Farming Tools', category: 'Equipment' },
    { id: 5, title: 'Organic Products', category: 'Organic' },
    { id: 6, title: 'Irrigation', category: 'Equipment' },
  ];

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
            <Image className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Gallery
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Explore our wide range of agricultural products
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {images.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square bg-gradient-to-br from-green-50 to-green-100 rounded-xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="w-12 h-12 text-green-300 group-hover:text-green-600 transition-colors" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-green-200 text-sm">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;