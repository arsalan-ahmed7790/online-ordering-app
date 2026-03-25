import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { ordersAPI } from '@/services/api';
import { toast } from 'sonner';

export default function CartSidebar() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
    isLoading,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    delivery_address: '',
    phone_number: '',
    notes: '',
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      setIsCartOpen(false);
      return;
    }

    try {
      setIsCheckingOut(true);
      
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      await ordersAPI.create({
        items: orderItems,
        delivery_address: checkoutData.delivery_address,
        phone_number: checkoutData.phone_number,
        notes: checkoutData.notes,
      });

      toast.success('Order placed successfully!');
      clearCart();
      setShowCheckoutForm(false);
      setIsCartOpen(false);
      setCheckoutData({ delivery_address: '', phone_number: '', notes: '' });
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to place order';
      toast.error(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const deliveryFee = 2.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + deliveryFee + tax;

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl cart-sidebar ${
          isCartOpen ? 'open' : ''
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-orange" />
              <h2 className="font-display text-xl">Your Cart</h2>
              {totalItems > 0 && (
                <span className="bg-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setShowCheckoutForm(false);
              }}
              className="w-10 h-10 rounded-full bg-gray flex items-center justify-center hover:bg-gray-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-full bg-gray flex items-center justify-center mb-4">
                  <ShoppingBag className="w-12 h-12 text-gray-text" />
                </div>
                <h3 className="font-display text-lg text-black mb-2">Please Sign In</h3>
                <p className="text-gray-text text-sm mb-6">
                  Sign in to add items to your cart and place orders
                </p>
                <Link to="/login" className="btn-primary" onClick={() => setIsCartOpen(false)}>
                  Sign In
                </Link>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-full bg-gray flex items-center justify-center mb-4">
                  <ShoppingBag className="w-12 h-12 text-gray-text" />
                </div>
                <h3 className="font-display text-lg text-black mb-2">Your cart is empty</h3>
                <p className="text-gray-text text-sm mb-6">
                  Add some delicious items to get started!
                </p>
                <button onClick={() => setIsCartOpen(false)} className="btn-primary">
                  Browse Menu
                </button>
              </div>
            ) : showCheckoutForm ? (
              /* Checkout Form */
              <form onSubmit={handleCheckout} className="space-y-4">
                <h3 className="font-display text-lg mb-4">Checkout</h3>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    value={checkoutData.delivery_address}
                    onChange={(e) => setCheckoutData({ ...checkoutData, delivery_address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-border rounded-xl focus:ring-2 focus:ring-orange focus:border-transparent"
                    rows={3}
                    required
                    placeholder="Enter your full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={checkoutData.phone_number}
                    onChange={(e) => setCheckoutData({ ...checkoutData, phone_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-border rounded-xl focus:ring-2 focus:ring-orange focus:border-transparent"
                    required
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={checkoutData.notes}
                    onChange={(e) => setCheckoutData({ ...checkoutData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-border rounded-xl focus:ring-2 focus:ring-orange focus:border-transparent"
                    rows={2}
                    placeholder="Any special instructions..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    className="flex-1 py-3 border border-gray-border rounded-full font-medium hover:bg-gray transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isCheckingOut}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    {isCheckingOut ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Place Order
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Cart Items */
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-gray rounded-xl p-4 animate-slide-in-right"
                  >
                    {/* Image */}
                    <img
                      src={item.product?.image_url || '/hero-burger.jpg'}
                      alt={item.product?.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-black mb-1">
                        {item.product?.name}
                      </h4>
                      <p className="text-orange font-semibold text-sm mb-2">
                        ${item.product?.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading}
                            className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-orange hover:text-white transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                            className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-orange hover:text-white transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                          className="text-gray-text hover:text-red transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Only show when cart has items and not in checkout form */}
          {items.length > 0 && !showCheckoutForm && (
            <div className="border-t border-gray-border p-6 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-text">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-text">Delivery Fee</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-text">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-border pt-2 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-xl text-orange">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setShowCheckoutForm(true)}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                disabled={isLoading}
                className="w-full py-2 text-sm text-gray-text hover:text-red transition-colors"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
