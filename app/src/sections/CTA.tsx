import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Apple, Play } from 'lucide-react';

export default function CTA() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="download"
      ref={ref}
      className="py-20 bg-gradient-to-br from-white to-orange/5 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-orange/5 rounded-full blur-2xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div
            className={`space-y-6 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-black">
              Download Our{' '}
              <span className="text-orange">Mobile App</span>
            </h2>
            <p className="text-gray-text text-lg max-w-md">
              Get exclusive offers and track your orders in real-time. Available
              on iOS and Android.
            </p>

            {/* Features */}
            <ul className="space-y-3">
              {[
                'Exclusive app-only deals',
                'Real-time order tracking',
                'Easy reordering',
                'Push notifications for offers',
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-sm text-black"
                >
                  <span className="w-5 h-5 rounded-full bg-orange/20 text-orange flex items-center justify-center text-xs">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 animate-button-glow">
                <Apple className="w-7 h-7" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Download on the</p>
                  <p className="font-semibold">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 animate-button-glow">
                <Play className="w-7 h-7" fill="currentColor" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="font-semibold">Google Play</p>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-20'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="relative animate-phone-float">
              <img
                src="/phone-mockup.jpg"
                alt="FoodExpress Mobile App"
                className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              />
              {/* Floating elements */}
              <div
                className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-float-gentle"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-semibold text-sm">20% OFF</p>
                    <p className="text-xs text-gray-text">First Order</p>
                  </div>
                </div>
              </div>
              <div
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float-gentle"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-semibold text-sm">Fast</p>
                    <p className="text-xs text-gray-text">Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
