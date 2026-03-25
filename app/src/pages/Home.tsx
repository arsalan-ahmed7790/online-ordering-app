import { useState } from 'react';
import Header from '@/sections/Header';
import Hero from '@/sections/Hero';
import Categories from '@/sections/Categories';
import FoodGrid from '@/sections/FoodGrid';
import CartSidebar from '@/sections/CartSidebar';
import HowToOrder from '@/sections/HowToOrder';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Categories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <FoodGrid activeCategory={activeCategory} />
        <HowToOrder />
        <CTA />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
