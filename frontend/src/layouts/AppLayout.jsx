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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link to={homePath} className="flex items-center gap-2 group">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">MyFuel</span>
              </Link>
              <nav className="hidden sm:flex items-center gap-2 ml-4" aria-label="Dashboard navigation">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/10'
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
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-3 pr-4 border-r border-gray-200">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 leading-none">{user.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
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
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div id="mobile-nav" className="sm:hidden border-t bg-gray-50/95 backdrop-blur-sm shadow-inner absolute w-full z-40">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      'block rounded-md px-3 py-3 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-800 shadow-sm'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
                    ].join(' ')
                  }
                  end
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="border-t px-5 py-4 border-gray-200">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="mt-3 w-full text-left bg-red-50 text-red-700 px-3 py-2 rounded-md font-medium text-sm hover:bg-red-100"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <Outlet />
      </main>
    </div>
  );
}
