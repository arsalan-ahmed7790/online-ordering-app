import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToMenu = () => {
    const element = document.querySelector('#menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-gray"
    >
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-10 w-64 h-64 bg-orange/20 animate-float-morph-1"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-40 right-20 w-48 h-48 bg-orange/15 rounded-full animate-float-gentle"
          style={{ animationDelay: '2s', animationDuration: '8s' }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-32 h-32 bg-orange/10 rounded-full animate-float-gentle"
          style={{ animationDelay: '4s', animationDuration: '10s' }}
        />
        <div
          className="absolute bottom-40 right-1/3 w-56 h-56 bg-orange/10 animate-float-morph-1"
          style={{ animationDelay: '6s', animationDuration: '15s' }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <h1
              className={`font-display text-4xl sm:text-5xl lg:text-6xl text-black leading-tight transition-all duration-1000 ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <span
                className="inline-block"
                style={{ transitionDelay: '300ms' }}
              >
                Delicious Food
              </span>{' '}
              <span
                className="inline-block text-orange"
                style={{ transitionDelay: '400ms' }}
              >
                Delivered
              </span>{' '}
              <span
                className="inline-block"
                style={{ transitionDelay: '500ms' }}
              >
                To Your Door
              </span>
            </h1>

            <p
              className={`text-lg text-gray-text max-w-lg transition-all duration-700 ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              Order from the best local restaurants and get your favorite meals
              delivered fast. Fresh, hot, and exactly how you like it.
            </p>

            <div
              className={`flex flex-wrap gap-4 transition-all duration-500 ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              <button
                onClick={scrollToMenu}
                className="btn-primary flex items-center gap-2 group"
              >
                Order Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => {
                  const element = document.querySelector('#download');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-3 rounded-full font-semibold border-2 border-orange text-orange hover:bg-orange hover:text-white transition-all duration-300"
              >
                Download App
              </button>
            </div>

            {/* Stats */}
            <div
              className={`flex gap-8 pt-8 transition-all duration-700 ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '1100ms' }}
            >
              <div>
                <p className="font-display text-3xl text-orange">500+</p>
                <p className="text-sm text-gray-text">Restaurants</p>
              </div>
              <div>
                <p className="font-display text-3xl text-orange">50k+</p>
                <p className="text-sm text-gray-text">Happy Customers</p>
              </div>
              <div>
                <p className="font-display text-3xl text-orange">30min</p>
                <p className="text-sm text-gray-text">Avg. Delivery</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className={`relative transition-all duration-1000 ${
              isLoaded
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-20'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="relative animate-hero-float">
              <img
                src="/hero-burger.jpg"
                alt="Delicious burger with fries"
                className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-float-gentle">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange/20 flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Fast Delivery</p>
                    <p className="text-xs text-gray-text">30 minutes or free</p>
                  </div>
                </div>
              </div>
              {/* Rating badge */}
              <div
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float-gentle"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="font-semibold">4.9</span>
                  <span className="text-gray-text text-sm">(2k+ reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
