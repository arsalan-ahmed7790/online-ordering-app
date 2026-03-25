import { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { ordersAPI } from '@/services/api';
import type { Order, OrderStatus } from '@/types';
import { toast } from 'sonner';

const statusOptions: OrderStatus[] = ['pending', 'preparing', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update status';
      toast.error(message);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl">Orders</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-text" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-border rounded-xl focus:ring-2 focus:ring-orange focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="px-4 py-3 border border-gray-border rounded-xl focus:ring-2 focus:ring-orange focus:border-transparent"
        >
          <option value="all">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Order ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Total</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-text">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-border hover:bg-gray/50">
                    <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-text">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">${order.total_price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status]}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-text">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-8 h-8 rounded-lg bg-gray text-black flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-border flex items-center justify-between">
              <h3 className="font-display text-xl">Order #{selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg bg-gray flex items-center justify-center hover:bg-gray-border"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-sm text-gray-text mb-2">Customer</h4>
                <p className="font-medium">{selectedOrder.user?.name}</p>
                <p className="text-sm text-gray-text">{selectedOrder.user?.email}</p>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-sm text-gray-text mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-gray rounded-lg">
                      <img
                        src={item.product?.image_url || '/hero-burger.jpg'}
                        alt={item.product?.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product?.name}</p>
                        <p className="text-xs text-gray-text">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-text mb-1">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-text mb-1">Total</h4>
                  <p className="font-display text-lg text-orange">${selectedOrder.total_price.toFixed(2)}</p>
                </div>
              </div>

              {selectedOrder.delivery_address && (
                <div>
                  <h4 className="font-medium text-sm text-gray-text mb-1">Delivery Address</h4>
                  <p className="text-sm">{selectedOrder.delivery_address}</p>
                </div>
              )}

              {selectedOrder.notes && (
                <div>
                  <h4 className="font-medium text-sm text-gray-text mb-1">Notes</h4>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm text-gray-text mb-1">Order Date</h4>
                <p className="text-sm">{formatDate(selectedOrder.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
