const Customers = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">View registered customers.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Coming Soon</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Customer management is not yet implemented. This will allow you to view, search, and manage registered users.
        </p>
      </div>
    </div>
  );
};

export default Customers;
