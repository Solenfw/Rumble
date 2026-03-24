import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Database, Save } from "lucide-react";
import { handleSignOut } from "@services/authService";
import { useAuth } from "@contexts/authContext";
import { ELEMENTS } from "@constants";

// NewsItem component for rendering individual news (to be replaced with API data later)
const NewsItem = ({ title, image }: { title: string; image: string }) => (
  <div className="bg-white rounded-xl p-6 flex justify-between items-center border-2 border-gray-400 hover:shadow-md transition">
    <p className="flex-1 text-gray-800">{title}</p>
    <img src={image} alt="news" className="w-40 h-24 object-cover rounded-md" />
  </div>
);

export default function Home() {
  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
  const userName = user?.user_metadata?.full_name || "Your username";

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("home");

  type NewsItemType = {
    title: string;
    image: string;
  };
  const [news, setNews] = useState<NewsItemType[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");

  // Update news data and timestamp
  const updateNews = (newData: NewsItemType[]) => {
    setNews(newData);
    const now = new Date().toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setLastUpdated(now);
  };

  useEffect(() => {
    // Placeholder news data (replace with API call later)
    updateNews([
      {
        title: "S&P downgrades Botswana as diamond sector faces global headwinds.",
        image: ELEMENTS.IMAGES.NEWS,
      },
    ]);
  }, []);

  return (
    <div className="h-screen bg-[#1f1f1f] text-black font-mono flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between relative items-center bg-[#cdd8c0] px-4 py-2 border-b border-gray-400">
        {/* LEFT */}
        <div className="ml-0 items-center">
          <Link
            to="/globe"
            className="inline-block bg-black text-white text-xl px-3 py-2 rounded-md font-bold shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,0,0,0.8)] transition duration-300"
          >
            EXPLORE
          </Link>
          <div className="inline-block absolute left-1/2 -translate-x-1/2">
            <p className="text-lg text-gray-1200 italic">
              {user?.user_metadata?.about || (
                <>Welcome back, <span className="font-bold">{userName}</span>!</>
              )}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 relative">
          <Moon className="w-8 h-8 cursor-pointer" />
          <div className="relative cursor-pointer" onClick={() => setOpen(!open)}>
            <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
            {open && (
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-md shadow-lg py-2 z-50">
                <p className="px-4 py-2 text-sm font-medium">{userName}</p>
                <hr />
                <Link to="/settings">
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</p>
                </Link>
                <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleSignOut}>
                  Sign out
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <div className="w-25 bg-[#b7c7a8] flex flex-col items-center py-4 space-y-4">
          <div
            onClick={() => setTab("home")}
            className={`p-10 rounded-md cursor-pointer transition ${
              tab === "home" ? "bg-white" : "bg-[#b7c7a8] hover:scale-105"
            }`}
          >
            <Save className="w-7 h-7" />
          </div>
          <div
            onClick={() => setTab("storage")}
            className={`p-10 rounded-md cursor-pointer transition ${
              tab === "storage" ? "bg-white" : "bg-[#b7c7a8] hover:scale-105"
            }`}
          >
            <Database className="w-7 h-7" />
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 bg-[#e5e5e5] p-6 overflow-y-auto">
          {/* HOME TAB */}
          {tab === "home" && (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-black mb-2 tracking-wide drop-shadow-md">Global News!</h1>
              <p className="text-sm text-gray-600 mb-6 italic">Last updated: {lastUpdated}</p>
              <div className="space-y-6">
                {news.map((item, index) => (
                  <NewsItem key={index} title={item.title} image={item.image} />
                ))}
              </div>
            </div>
          )}

          {/* STORAGE TAB */}
          {tab === "storage" && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">No saved earthquake data yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}