import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Search, Bell, Menu, User as UserIcon, LogOut, LayoutDashboard, Video, Home, Heart, History } from 'lucide-react';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${searchQuery}`);
    }
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
          isActive ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Icon size={20} />
        <span className={`${!sidebarOpen && 'hidden md:hidden lg:inline'}`}>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Video size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-800 hidden sm:block">SmartStream</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-indigo-500 rounded-full py-2 px-4 pl-10 outline-none transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-indigo-500" size={18} />
          </div>
        </form>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === UserRole.ADMIN && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition"
                >
                  <LayoutDashboard size={16} /> Admin
                </button>
              )}
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="relative group">
                <button className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  <img src={user.avatar} alt="User" />
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block p-1">
                   <div className="px-4 py-2 border-b border-gray-100">
                     <p className="text-sm font-bold text-gray-800">{user.username}</p>
                     <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                   </div>
                   <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                     <UserIcon size={16}/> Profile
                   </button>
                   <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                     <LogOut size={16}/> Logout
                   </button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm">
              Sign In
            </Link>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
          }`}
        >
          <nav className="p-2 space-y-1">
            <NavItem to="/" icon={Home} label="Home" />
            <NavItem to="/profile?tab=history" icon={History} label="History" />
            <NavItem to="/profile?tab=favorites" icon={Heart} label="Favorites" />
            {user?.role === UserRole.ADMIN && (
                 <div className="pt-4 mt-4 border-t border-gray-100">
                    <p className={`px-4 text-xs font-bold text-gray-400 uppercase mb-2 ${!sidebarOpen && 'hidden'}`}>Admin</p>
                    <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
                 </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
