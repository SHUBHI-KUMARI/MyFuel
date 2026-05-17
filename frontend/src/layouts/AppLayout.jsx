import React, { useState } from 'react';
import { Outlet, Navigate, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function AppLayout() {
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading app...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const homePath = user.role === 'admin' ? '/admin/orders' : '/dashboard';
  const navItems = user.role === 'admin'
    ? [{ to: '/admin/orders', label: 'Orders' }]
    : [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/place-order', label: 'Place Order' },
      { to: '/order-history', label: 'Order History' },
    ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link to={homePath} className="text-2xl font-bold text-blue-600">
                MyFuel
              </Link>
              <nav className="hidden sm:flex items-center gap-1" aria-label="Dashboard navigation">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                      ].join(' ')
                    }
                    end
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Sign out
              </button>
            </div>
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              aria-controls="mobile-nav"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="sr-only">Toggle navigation</span>
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen ? (
          <div id="mobile-nav" className="sm:hidden border-t">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                    ].join(' ')
                  }
                  end
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="border-t px-4 py-3">
              <div className="text-sm font-medium text-gray-700">
                {user.name} ({user.role})
              </div>
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : null}
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
