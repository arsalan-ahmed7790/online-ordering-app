import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, ChefHat } from 'lucide-react';
import { ordersAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { Order } from '@/types';
import { toast } from 'sonner';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-blue-100 text-blue-700',
    icon: ChefHat,
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to fetch orders';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-text mx-auto mb-4" />
          <h2 className="font-display text-2xl text-black mb-2">Please Login</h2>
          <p className="text-gray-text mb-6">You need to be logged in to view your orders</p>
          <Link to="/login" className="btn-primary inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl text-black">My Orders</h1>
            <p className="text-sm text-gray-text">Track and manage your orders</p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-text mx-auto mb-4" />
            <h3 className="font-display text-xl text-black mb-2">No orders yet</h3>
            <p className="text-gray-text mb-6">You haven't placed any orders yet</p>
            <Link to="/" className="btn-primary inline-block">
              Browse Menu
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-text">Order #{order.id}</p>
                      <p className="text-sm text-gray-text">{formatDate(order.created_at)}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{status.label}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.product?.image_url || '/hero-burger.jpg'}
                          alt={item.product?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product?.name}</p>
                          <p className="text-sm text-gray-text">
                            ${item.price} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="border-t border-gray-border pt-4 flex items-center justify-between">
                    <div>
                      {order.delivery_address && (
                        <p className="text-sm text-gray-text">
                          📍 {order.delivery_address}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-text">Total</p>
                      <p className="font-display text-xl text-orange">
                        ${order.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
