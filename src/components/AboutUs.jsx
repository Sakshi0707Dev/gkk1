import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
      >
        ← Go Back
      </button>
      
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
        About Gawande Krushi Kendra
      </h2>
      
      <p className="text-gray-600 mb-4 leading-relaxed">
        Gawande Krushi Kendra was established in 2006 with the vision of helping farmers by providing reliable agricultural products and expert farming guidance.
        The business was originally started with the name Vaishali Krushi Kendra by the founder Bhagawanrao Sharmao Gawande.
        Later the shop was renamed to Gawande Krushi Kendra as it expanded and gained trust among farmers.
      </p>
      
      <div className="border-l-4 border-green-600 pl-4 space-y-2 mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Leadership Timeline</h3>
        <p className="text-gray-600">Founder (2006): Bhagawanrao Sharmao Gawande</p>
        <p className="text-gray-600">CEO - First Generation: Gajanan Bhagwanrao Gawande</p>
        <p className="text-gray-600">CEO - Second Generation: Bharat Bhagwanrao Gawande</p>
        <p className="text-gray-600">Current CEO (2026 - Present): Omkesh Bharat Gawande</p>
      </div>
    </div>
  );
};

export default AboutUs;