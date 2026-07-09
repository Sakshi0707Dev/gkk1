const Analytics = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">View sales and performance metrics.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Coming Soon</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Analytics dashboard is not yet implemented. This will show sales charts, order trends, popular products, and revenue data.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
