import { ArrowLeft, Search, LogOut, Bell, Check, XCircle, FileText } from 'lucide-react';
import { Notification } from '../services/notificationService';

// Dashboard header component
interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: React.ReactNode;
  user?: {
    name: string;
    role: string;
    image?: string;
  };
  hideLogout?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  hideSearch?: boolean;
  hideNotifications?: boolean;

  // New Notification Props
  notifications?: Notification[];
  unreadCount?: number;
  isNotificationOpen?: boolean;
  setIsNotificationOpen?: (open: boolean) => void;
  handleMarkAsRead?: (id: string) => void;
  handleMarkAllAsRead?: () => void;
  extraActions?: React.ReactNode;
  onViewQuotation?: (id: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title, subtitle, onBack, action, user, hideLogout, searchValue, onSearchChange,
  hideSearch, hideNotifications,
  notifications = [],
  unreadCount = 0,
  isNotificationOpen = false,
  setIsNotificationOpen = () => { },
  handleMarkAsRead = () => { },
  handleMarkAllAsRead = () => { },
  extraActions,
  onViewQuotation
}) => {
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-transparent mb-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Left section: Back button + Title/Date */}
        <div className="flex items-start gap-5">
          {onBack && (
            <button
              onClick={onBack}
              className="mt-1 p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {currentDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right section - Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {!hideSearch && (
            <div className="relative hidden lg:block group">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 w-72 transition-all shadow-sm placeholder:text-slate-300 font-medium"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                <Search size={18} strokeWidth={2.5} />
              </span>
            </div>
          )}

          {/* Notification System */}
          {!hideNotifications && (
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`p-2.5 rounded-xl border transition-all relative ${isNotificationOpen ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce-slow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                  <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white border border-white rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-6 bg-slate-900 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg">Notifications</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-lg">Real-time</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-white/50 text-xs font-medium">{unreadCount} unread alerts</p>
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto main-content-scroll bg-slate-50/50">
                      {notifications.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
                          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                            <Bell size={24} />
                          </div>
                          <p className="text-sm font-bold text-slate-400">All caught up!</p>
                          <p className="text-[10px] text-slate-300 font-medium px-4">No new updates on quotations or sales activity.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => handleMarkAsRead(notif.id)}
                              className={`p-5 flex gap-4 hover:bg-white transition-all cursor-pointer group ${!notif.isRead ? 'bg-white' : ''}`}
                            >
                              <div className={`size-10 rounded-xl shrink-0 flex items-center justify-center ${notif.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-500' :
                                notif.type === 'WARNING' ? 'bg-amber-50 text-amber-500' :
                                  'bg-blue-50 text-blue-500'
                                }`}>
                                {notif.type === 'SUCCESS' ? <Check size={18} /> :
                                  notif.type === 'WARNING' ? <XCircle size={18} /> :
                                    <FileText size={18} />}
                              </div>
                              <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-bold text-slate-800">{notif.title}</span>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap shrink-0">
                                    {(() => {
                                      const notifDate = new Date(notif.createdAt);
                                      const today = new Date();
                                      const isToday = notifDate.toDateString() === today.toDateString();
                                      const time = notifDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                      if (isToday) {
                                        return time;
                                      }
                                      const date = notifDate.toLocaleDateString([], { day: '2-digit', month: 'short' });
                                      return `${date}, ${time}`;
                                    })()}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                                  {notif.message}
                                </p>
                                {notif.quotationId && onViewQuotation && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onViewQuotation(notif.quotationId!);
                                      handleMarkAsRead(notif.id);
                                    }}
                                    className="mt-2 w-fit px-3 py-1 bg-slate-100 hover:bg-[#394ca7] hover:text-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                                  >
                                    View Details
                                  </button>
                                )}
                                {!notif.isRead && (
                                  <div className="size-1.5 bg-primary rounded-full mt-1"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Custom Actions Slot */}
          {extraActions && (
            <div className="flex items-center gap-3">
              {extraActions}
            </div>
          )}

          {/* Custom Action (e.g., Create Button) */}
          {action && (
            <div className="flex items-center">
              {action}
            </div>
          )}


        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

