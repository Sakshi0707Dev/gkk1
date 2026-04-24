import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, ArrowRight } from 'lucide-react';
import { blogPosts } from './BlogList';

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
          <Link to="/blog" className="text-[#2E7D32] hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#2E7D32] font-semibold hover:text-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>
      </div>

      {/* Hero Image */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-video rounded-xl overflow-hidden mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2E7D32] bg-[#2E7D32]/10 px-4 py-1.5 rounded-full">
              <Tag className="w-4 h-4" />
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {post.title}
          </h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed text-lg">{post.content}</p>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Key Points</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Choose the right products for your soil type</li>
            <li>Follow recommended dosage instructions</li>
            <li>Monitor crop health regularly</li>
            <li>Consult experts for specific problems</li>
          </ul>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.id}`}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 line-clamp-2">{related.title}</h4>
                    <span className="text-sm text-[#2E7D32] flex items-center gap-1 mt-1">
                      Read more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogDetail;