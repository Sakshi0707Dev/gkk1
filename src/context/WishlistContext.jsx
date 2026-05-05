import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

const getStoredWishlist = () => {
  try {
    const stored = localStorage.getItem('gkk_wishlist');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(getStoredWishlist);

  useEffect(() => {
    localStorage.setItem('gkk_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};