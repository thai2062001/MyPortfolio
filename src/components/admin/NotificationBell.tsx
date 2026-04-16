import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCheck } from "lucide-react";
import { useContactNotifications } from "@/hooks/useContactNotifications";
import { useNavigate } from "react-router-dom";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { unreadCount, notifications, markAsRead, markAllAsRead } =
    useContactNotifications();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (messageId: string) => {
    markAsRead(messageId);
    navigate(`/admin/contact-messages?messageId=${messageId}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          isOpen || isHovered
            ? "text-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
        title="Notifications"
      >
        <Bell
          size={20}
          className={`transition-transform duration-300 ${
            isHovered ? "rotate-12 scale-105" : ""
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent">
            <h3 className="font-semibold text-gray-900">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors hover:bg-blue-100 px-2 py-1 rounded"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                Mark all
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 animate-in fade-in slide-in-from-left-2"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {notification.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {notification.email}
                        </p>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                          {notification.subject || notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="text-gray-400 hover:text-red-600 flex-shrink-0 transition-colors duration-200"
                        title="Mark as read"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No new notifications
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
              <button
                onClick={() => {
                  navigate("/admin/contact-messages");
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors hover:bg-blue-100 py-2 rounded"
              >
                View all messages
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
