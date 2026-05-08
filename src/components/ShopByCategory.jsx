import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './ShopByCategory.css';

import seedsImg from '../assets/seeds.png';
import fertilizersImg from '../assets/fertilizer.png';
import pesticidesImg from '../assets/pesticides.png';
import equipmentImg from '../assets/tools.png';
import organicImg from '../assets/organic.png';
import irrigationImg from '../assets/irrigation.png';

const categories = [
  { name: 'Seeds', slug: 'seeds', image: seedsImg },
  { name: 'Fertilizers', slug: 'fertilizers', image: fertilizersImg },
  { name: 'Pesticides', slug: 'pesticides', image: pesticidesImg },
  { name: 'Farming Equipment', slug: 'farming-equipment', image: equipmentImg },
  { name: 'Organic', slug: 'organic', image: organicImg },
  { name: 'Irrigation', slug: 'irrigation', image: irrigationImg },
];

const ShopByCategory = () => {
  const { language } = useLanguage();

  return (
    <section className="shop-by-category py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="category-section-title">
          <span className="title-accent"></span>
          {language === 'mar' ? 'श्रेणीनुसार खरेदी करा' : 'Shop by Category'}
        </h2>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="category-card"
            >
              <div className="card-image-wrapper">
                <img
                  src={category.image}
                  alt={category.name}
                  className="card-image"
                  onError={(e) => { e.target.style.opacity = '0.3'; }}
                />
              </div>
              <span className="card-name">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;