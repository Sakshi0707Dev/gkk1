import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

const ShippingPolicyButton = ({ text = 'View Shipping Policy' }) => {
  return (
    <Link
      to="/shipping-policy"
      className="inline-flex items-center gap-2 bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1B5E20] transition-colors shadow-md hover:shadow-lg"
    >
      <Truck className="w-5 h-5" />
      {text}
    </Link>
  );
};

export default ShippingPolicyButton;