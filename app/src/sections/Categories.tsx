import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { categoriesAPI } from '@/services/api';
import { Pizza, Beef, Fish, IceCream, Coffee, LayoutGrid } from 'lucide-react';
import type { Category } from '@/types';
import { toast } from 'sonner';

interface CategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  pizza: Pizza,
  burger: Beef,
  sushi: Fish,
  dessert: IceCream,
  drinks: Coffee,
};

export default function Categories({ activeCategory, onCategoryChange }: CategoriesProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Build category list with icons
  const categoryList = [
    { id: 'all', name: 'All', icon: LayoutGrid },
    ...categories.map((cat) => ({
      id: cat.name.toLowerCase(),
      name: cat.name,
      icon: iconMap[cat.name.toLowerCase()] || LayoutGrid,
    })),
  ];

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-12 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Browse By Category</h2>
        <div
          className={`flex flex-wrap justify-center gap-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {categoryList.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`category-pill flex items-center gap-2 ${
                  activeCategory === category.id ? 'active' : 'bg-gray text-black'
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
