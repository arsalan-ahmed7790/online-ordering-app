import { useEffect, useState } from 'react';
import { Navigate, Link, Routes, Route, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  List,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  ChevronRight,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI } from '@/services/api';
import type { DashboardStats } from '@/types';
import { toast } from 'sonner';

// Admin Components
import AdminProducts from '@/components/admin/AdminProducts';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminUsers from '@/components/admin/AdminUsers';

const sidebarItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/categories', icon: List, label: 'Categories' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: Users, label: 'Users' },
];

// Dashboard Overview Component
function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await ordersAPI.getStats();
      setStats(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Products',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      label: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingBag,
      color: 'bg-orange',
    },
    {
      label: 'Total Revenue',
      value: `$${(stats?.total_revenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-text">{stat.label}</p>
                  <p className="font-display text-2xl text-black mt-1">
                    {isLoading ? (
                      <span className="inline-block w-8 h-4 bg-gray animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} text-white flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-border flex items-center justify-between">
          <h3 className="font-display text-lg">Recent Orders</h3>
          <Link
            to="/admin/orders"
            className="text-orange hover:text-red text-sm font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Order ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Total</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-text">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : stats?.recent_orders?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-text">
                    No orders yet
                  </td>
                </tr>
              ) : (
                stats?.recent_orders?.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-t border-gray-border hover:bg-gray/50">
                    <td className="px-6 py-4 text-sm">#{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm font-medium">${order.total_price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'preparing'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-text">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Redirect if not admin
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-black text-white z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="inline-block">
            <span className="font-display text-xl">
              <span className="text-orange">Food</span>
              <span className="text-white">Express</span>
            </span>
          </Link>
          <p className="text-xs text-gray-text mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-orange text-white'
                    : 'text-gray-text hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-text hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-gray flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-gray-text">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange text-white flex items-center justify-center font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/users" element={<AdminUsers />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
