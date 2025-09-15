import  { useEffect, useMemo, useState } from "react";
import { Bell, Check, Trash2, Search } from "lucide-react";

// NotificationScreen.tsx
// React + TypeScript + Tailwind CSS component for a Student LMS notification screen.
// Uses lucide-react for icons. Drop into your components/ folder and render <NotificationScreen />.

type NotificationType = "announcement" | "assignment" | "grade" | "forum";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string; // ISO
  read: boolean;
};

// --- Sample random notifications (generated at runtime) ---
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "n_1",
    title: "New assignment: Linear Algebra HW4",
    message: "Homework 4 has been posted — due next Friday. Make sure to submit via Gradescope.",
    type: "assignment",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    read: false,
  },
  {
    id: "n_2",
    title: "Exam schedule updated",
    message: "Midterm has moved to Oct 5. Check the course calendar for details.",
    type: "announcement",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    read: true,
  },
  {
    id: "n_3",
    title: "Grade posted: Chemistry Lab 2",
    message: "Your Lab 2 grade is available. Visit the Grades page to view feedback.",
    type: "grade",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
  },
  {
    id: "n_4",
    title: "New reply in: Study Group - Week 3",
    message: "A classmate replied to your post in the study group forum.",
    type: "forum",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: "n_5",
    title: "TA hours changed",
    message: "TA hours on Tuesday are canceled this week. Office hour will be rescheduled.",
    type: "announcement",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    read: true,
  },
];

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    // In real app, replace with fetch to your notifications API.
    setNotifications((prev) => (prev && prev.length ? prev : SAMPLE_NOTIFICATIONS));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filtered = useMemo(() => {
    return (
      notifications
        .filter((n) => (filter === "all" ? true : filter === "unread" ? !n.read : n.read))
        .filter((n) => {
          if (!query) return true;
          const q = query.toLowerCase();
          return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
        })
        // newest first
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  }, [notifications, filter, query]);

  function toggleRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }

  function deleteNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function timeFromNow(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    return `${day}d ago`;
  }

  function typeBadge(type: NotificationType) {
    switch (type) {
      case "assignment":
        return (
          <span className="text-xs font-medium px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Assignment</span>
        );
      case "grade":
        return <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-800 rounded">Grade</span>;
      case "forum":
        return <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Forum</span>;
      default:
        return (
          <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-800 rounded">Announcement</span>
        );
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100">
            <Bell className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Notifications</h1>
            <p className="text-sm text-gray-500">Student Inbox — important course updates and activity</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Mark all read
            </button>
            <div className="text-sm text-gray-600">{unreadCount} unread</div>
          </div>
          <div className="sm:hidden text-sm text-gray-600">{unreadCount}</div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded border border-gray-200 focus:ring-0 focus:outline-none"
                placeholder="Search notifications..."
                aria-label="Search notifications"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded text-sm ${filter === "all" ? "bg-gray-100" : "bg-transparent"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded text-sm ${filter === "unread" ? "bg-gray-100" : "bg-transparent"}`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-3 py-1 rounded text-sm ${filter === "read" ? "bg-gray-100" : "bg-transparent"}`}
            >
              Read
            </button>
          </div>
        </div>

        <ul role="list" className="divide-y">
          {filtered.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No notifications match your filters.</li>
          ) : (
            filtered.map((n) => (
              <li key={n.id} className="p-4 sm:p-5 flex gap-4 items-start">
                <div className="shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${n.read ? "bg-gray-100" : "bg-indigo-50"}`}>
                    <span className="text-sm font-semibold text-indigo-700">{n.type.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-medium truncate ${n.read ? "text-gray-700" : "text-gray-900"}`}>
                          {n.title}
                        </h3>
                        <div className="hidden sm:block">{typeBadge(n.type)}</div>
                      </div>
                      <p className={`mt-1 text-sm truncate ${n.read ? "text-gray-500" : "text-gray-600"}`}>{n.message}</p>
                    </div>

                    <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-400">{timeFromNow(n.createdAt)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRead(n.id)}
                          aria-label={n.read ? "Mark unread" : "Mark read"}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-gray-200 bg-white hover:bg-gray-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>{n.read ? "Unread" : "Read"}</span>
                        </button>

                        <button
                          onClick={() => deleteNotification(n.id)}
                          aria-label="Delete notification"
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-transparent bg-white hover:bg-gray-50 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="p-3 border-t flex items-center justify-between text-sm text-gray-500">
          <div>{notifications.length} total</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotifications(SAMPLE_NOTIFICATIONS)}
              className="px-3 py-1 rounded text-sm bg-transparent border border-gray-200 hover:bg-gray-50"
            >
              Reset
            </button>
            <div className="text-xs">Built for LMS student inbox</div>
          </div>
        </div>
      </div>
    </div>
  );
}
