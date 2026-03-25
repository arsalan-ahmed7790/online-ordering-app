import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Utensils, ShoppingCart, CreditCard, Smile } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Choose Your Food',
    description: 'Browse our menu and select your favorites from hundreds of options',
    icon: Utensils,
  },
  {
    id: 2,
    title: 'Add to Cart',
    description: 'Add items to your cart with one click and customize as needed',
    icon: ShoppingCart,
  },
  {
    id: 3,
    title: 'Checkout',
    description: 'Pay securely with multiple payment options available',
    icon: CreditCard,
  },
  {
    id: 4,
    title: 'Enjoy Your Meal',
    description: 'Fast delivery right to your door, hot and fresh',
    icon: Smile,
  },
];

export default function HowToOrder() {
  const { ref: sectionRef, isVisible: sectionVisible } =
    useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 bg-gray relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange/5 rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-orange/5 rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            sectionVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-display text-3xl sm:text-4xl text-black mb-4">
            How To <span className="text-orange">Order</span>
          </h2>
          <p className="text-gray-text max-w-xl mx-auto">
            Get your favorite food in 4 simple steps. It's quick, easy, and
            delicious!
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`text-center group transition-all duration-700 ${
                  sectionVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: sectionVisible ? `${300 + index * 150}ms` : '0ms',
                }}
              >
                {/* Icon */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-orange text-white flex items-center justify-center mx-auto transition-transform duration-400 group-hover:scale-110 animate-icon-float">
                    <Icon className="w-8 h-8" />
                  </div>
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red text-white text-sm font-bold flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    {step.id}
                  </div>
                  {/* Connector line (hidden on last item and mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gray-border -translate-y-1/2 animate-line-pulse" />
                  )}
                </div>

                {/* Content */}
                <h3 className="font-display text-lg text-black mb-2 transition-colors duration-300 group-hover:text-orange">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-text max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
