import { useState, useEffect } from 'react';
import { Plus, Check, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { productsAPI } from '@/services/api';
import type { Product } from '@/types';
import { toast } from 'sonner';

interface FoodGridProps {
  activeCategory: string;
}

function FoodCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    await addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      ref={ref}
      className={`food-card bg-white rounded-2xl overflow-hidden shadow-card transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{
        transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image_url || '/hero-burger.jpg'}
          alt={product.name}
          className="food-card-image w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="font-semibold text-orange">${product.price.toFixed(2)}</span>
        </div>
        {!product.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red text-white px-4 py-2 rounded-full text-sm font-medium">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg text-black">{product.name}</h3>
          {product.category && (
            <span className="text-xs text-gray-text bg-gray px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-text line-clamp-2 mb-4">
          {product.description || 'No description available'}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={!product.is_available || isAdded}
          className={`w-full py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            isAdded
              ? 'bg-success text-white'
              : product.is_available
              ? 'bg-orange text-white hover:bg-red'
              : 'bg-gray text-gray-text cursor-not-allowed'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              Added to Cart
            </>
          ) : !product.is_available ? (
            'Unavailable'
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function FoodGrid({ activeCategory }: FoodGridProps) {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params: { category_id?: number; search?: string } = {};
      
      if (activeCategory !== 'all') {
        // Map category slug to ID - we'll fetch all and filter client-side for simplicity
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products by category and search
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' ||
      product.category?.name.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={titleRef}
          className={`text-center mb-8 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-display text-3xl sm:text-4xl text-black mb-4">
            Our <span className="text-orange">Popular</span> Menu
          </h2>
          <p className="text-gray-text max-w-xl mx-auto mb-8">
            Discover our most loved dishes, crafted with fresh ingredients and delivered with care
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-text" />
            <input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-border rounded-xl focus:ring-2 focus:ring-orange focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Food Grid */}
        {!isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <FoodCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-text text-lg">No items found</p>
            <p className="text-sm text-gray-text mt-2">Try a different category or search term</p>
          </div>
        )}
      </div>
    </section>
  );
}
