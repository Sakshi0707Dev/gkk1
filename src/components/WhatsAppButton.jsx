import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919021605445"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50"
    >
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-gray-800 px-3 py-1.5 text-sm font-medium text-white shadow-lg opacity-0 transition-all duration-300 group-hover:opacity-100">
        Chat with us on WhatsApp
      </span>
      
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_25px_rgba(37,211,102,0.5)]">
        <FaWhatsapp className="h-7 w-7 text-white" />
      </div>
    </a>
  );
};

export default WhatsAppButton;