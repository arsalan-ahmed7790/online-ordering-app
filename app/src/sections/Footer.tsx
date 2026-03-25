import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Menu', href: '#menu' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Download App', href: '#download' },
];

const supportLinks = [
  { name: 'FAQ', href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Help Center', href: '#' },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
];

export default function Footer() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer ref={ref} className="bg-black text-white relative overflow-hidden">
      {/* Accent line */}
      <div
        className={`h-1 bg-orange transition-all duration-1000 ${
          isVisible ? 'w-full' : 'w-0'
        }`}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div
            className={`space-y-4 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <a href="#home" className="inline-block">
              <span className="font-display text-2xl">
                <span className="text-orange">Food</span>
                <span className="text-white">Express</span>
              </span>
            </a>
            <p className="text-gray-text text-sm">
              Delicious food delivered fast. Your favorite restaurants, now at
              your doorstep.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange hover:-translate-y-1 transition-all duration-300"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h3 className="font-display text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-gray-text text-sm hover:text-orange transition-colors duration-300 relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-orange transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <h3 className="font-display text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-text text-sm hover:text-orange transition-colors duration-300 relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-orange transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <h3 className="font-display text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange mt-0.5" />
                <div>
                  <p className="text-sm text-gray-text">Email</p>
                  <a
                    href="mailto:support@foodexpress.com"
                    className="text-sm hover:text-orange transition-colors"
                  >
                    support@foodexpress.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange mt-0.5" />
                <div>
                  <p className="text-sm text-gray-text">Phone</p>
                  <a
                    href="tel:+1234567890"
                    className="text-sm hover:text-orange transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange mt-0.5" />
                <div>
                  <p className="text-sm text-gray-text">Address</p>
                  <p className="text-sm">
                    123 Food Street, Cuisine City, FC 12345
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-gray-text text-sm">
            © 2024 FoodExpress. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-text text-sm hover:text-orange transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-text text-sm hover:text-orange transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-text text-sm hover:text-orange transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
