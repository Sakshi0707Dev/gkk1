import React from 'react';

const TrustSection = () => {
  const trusts = [
    { icon: '🌾', text: '10,000+ Farmers Trust Us' },
    { icon: '🚚', text: 'Fast Delivery' },
    { icon: '💳', text: 'Secure Payments' },
    { icon: '🌱', text: 'Quality Products' },
  ];

  return (
    <section className="bg-green-50 py-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {trusts.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm md:text-base text-gray-700">
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;