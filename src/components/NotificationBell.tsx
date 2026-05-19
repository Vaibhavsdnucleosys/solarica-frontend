import React from 'react';
import { Bell, Check, XCircle, FileText } from 'lucide-react';
import { Notification } from '../services/notificationService';

interface NotificationBellProps {
    notifications: Notification[];
    unreadCount: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    badgeColor?: string;
    pulseColor?: string;
    emptyMessage?: string;
    onViewQuotation?: (id: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    onMarkAsRead,
    onMarkAllAsRead,
    badgeColor = 'bg-[#394ca7]',
    emptyMessage = 'No new updates.',
    onViewQuotation
}) => {
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl border transition-all relative ${isOpen ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 size-5 ${badgeColor} text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce-slow`}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 text-left">
                        <div className="p-6 bg-slate-900 text-white">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-lg">Notifications</h3>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-lg">Real-time</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-white/50 text-xs font-medium">{unreadCount} unread alerts</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAllAsRead();
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest text-[#394ca7] hover:text-white transition-colors"
                                >
                                    Mark all as read
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto no-scrollbar overflow-x-hidden main-content-scroll bg-slate-50/50">
                            {notifications.length === 0 ? (
                                <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
                                    <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                                        <Bell size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400">All caught up!</p>
                                    <p className="text-[10px] text-slate-300 font-medium px-4">{emptyMessage}</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => onMarkAsRead(notif.id)}
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
                                                            onMarkAsRead(notif.id);
                                                        }}
                                                        className="mt-2 w-fit px-3 py-1 bg-slate-100 hover:bg-[#394ca7] hover:text-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                                                    >
                                                        View Details
                                                    </button>
                                                )}
                                                {!notif.isRead && (
                                                    <div className={`size-1.5 ${badgeColor.split(' ')[0]} rounded-full mt-1`}></div>
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
    );
};

export default NotificationBell;
