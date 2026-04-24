import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Best Fertilizers for Kharif Season 2024',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600',
    content: 'The Kharif season is here and choosing the right fertilizers is crucial for a bountiful harvest. Here are the top fertilizers every farmer should consider for this season...',
    category: 'Crop Nutrition',
    date: '2024-06-15',
    excerpt: 'Discover the best fertilizers for the Kharif season to maximize your crop yield.',
  },
  {
    id: 2,
    title: 'Modern Irrigation Techniques for Summer Crops',
    image: 'https://images.unsplash.com/photo-1563514227147-96b8a4f8e6e5?w=600',
    content: 'Water scarcity is a real challenge these days. Learn about drip irrigation, sprinkler systems, and other modern techniques to save water while keeping your crops healthy...',
    category: 'Equipment',
    date: '2024-05-22',
    excerpt: 'Learn modern irrigation techniques to save water and increase crop productivity.',
  },
  {
    id: 3,
    title: 'Organic Farming: A Complete Guide',
    image: 'https://images.unsplash.com/photo-1500937386664-2056e3ccfc37?w=600',
    content: 'Organic farming is gaining popularity as consumers increasingly prefer chemical-free produce. This guide covers everything from soil preparation to harvesting...',
    category: 'Organic',
    date: '2024-04-10',
    excerpt: 'Everything you need to know about transitioning to organic farming.',
  },
  {
    id: 4,
    title: 'Government Schemes for Farmers 2024',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed844ef?w=600',
    content: 'The Indian government offers various schemes for farmers. Here is a comprehensive list of schemes you can apply for in 2024...',
    category: 'Government Schemes',
    date: '2024-03-28',
    excerpt: 'A comprehensive guide to government schemes available for farmers.',
  },
  {
    id: 5,
    title: 'Pest Control: Natural Remedies',
    image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=600',
    content: 'Chemical pesticides can be harmful to the environment and human health. Here are some effective natural remedies for pest control...',
    category: 'Crop Protection',
    date: '2024-03-15',
    excerpt: 'Effective natural remedies for controlling pests without chemicals.',
  },
  {
    id: 6,
    title: 'Selecting the Right Seeds for Your Region',
    image: 'https://images.unsplash.com/photo-1574943320219-55306c322348?w=600',
    content: 'Choosing the right seeds depends on your soil type, climate, and water availability. This guide helps you make the right decision...',
    category: 'Seeds',
    date: '2024-02-20',
    excerpt: 'How to choose the perfect seeds for your specific region and conditions.',
  },
];

export { blogPosts };

const BlogList = () => {
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Crop Advisory Blog
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Expert tips and guidance for modern farming
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2E7D32] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogList;