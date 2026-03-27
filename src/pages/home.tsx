import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Database, Save, LogOut, Settings, Trash2 } from "lucide-react";
import { handleSignOut } from "@services/authService";
import { useAuth } from "@contexts/authContext";
import { NewsItemType } from "@types";
import { useAppStore } from "@store/useAppStore";
import { deleteSavedEarthquake } from "@services/detailService";

const NewsItem = ({ title, image, url }: NewsItemType) => {
  // Use a proxy to bypass the CORP/CORS block
  const proxyImageUrl = image ? `https://images.weserv.nl/?url=${encodeURIComponent(image)}` : null;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="bg-white rounded-xl p-6 flex justify-between items-center border-2 border-gray-400 group-hover:shadow-lg transition">
        <p className="flex-1 text-gray-800 font-medium">{title}</p>
        {proxyImageUrl && (
          <img 
            src={proxyImageUrl} 
            alt="news" 
            className="w-40 h-24 object-cover rounded-md ml-4" 
            onError={(e) => (e.currentTarget.style.display = 'none')} 
          />
        )}
      </div>
    </a>
  );
};

const UserDropdown = ({ name }: { name: string; onClose: () => void }) => (
  <div className="absolute top-12 right-0 w-44 bg-white rounded-md shadow-xl border py-2 z-50">
    <p className="px-4 py-2 text-sm font-bold border-b">{name}</p>
    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 items-center gap-2">
      <Settings size={16} /> Settings
    </Link>
    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 text-red-600">
      <LogOut size={16} /> Sign out
    </button>
  </div>
);

export default function Home() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loadingStorage, setLoadingStorage] = useState(false);

  // Use URL Search Params for Tab Navigation
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  // Pull cached data and functions from Zustand
  const { 
    news, 
    newsLastUpdated, 
    setNews, 
    savedEarthquakes, 
    savedLoaded, 
    fetchSaved,
    removeSavedEarthquake
  } = useAppStore();

  const handleDelete = async (e: React.MouseEvent, eqId: string) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!user?.id) return;
    if (!window.confirm("Remove this earthquake from your storage?")) return;

    const res = await deleteSavedEarthquake(eqId, user.id);
    
    if (res.success) {
      removeSavedEarthquake(eqId); 
    } else {
      alert("Failed to delete the earthquake. Please try again.");
    }
  };

  // News Fetching Logic (Only fetches if cache is empty)
  useEffect(() => {
    const fetchNews = async () => {
      if (news.length > 0) return; // Skip if already loaded in store
      
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (!apiKey) throw new Error("Missing API Key");

        const res = await fetch(`https://newsapi.org/v2/everything?q=science&apiKey=${apiKey}`);
        const data = await res.json();

        if (data.status === "ok" && Array.isArray(data.articles)) {
          const formattedNews = data.articles.map((a: any) => ({ 
            title: a.title, 
            image: a.urlToImage || "https://placehold.co/400x200?text=No+Image",
            url: a.url 
          }));
          setNews(formattedNews, new Date().toLocaleTimeString());
        }
      } catch (e) {
        console.error("Fetch failed:", e);
      }
    };
    fetchNews();
  }, [news.length, setNews]);

  // Storage Fetching Logic (Only fetches if not already loaded)
  useEffect(() => {
    if (tab === "storage" && !savedLoaded) {
      setLoadingStorage(true);
      fetchSaved().finally(() => setLoadingStorage(false));
    }
  }, [tab, savedLoaded, fetchSaved]);

  return (
    <div className="h-screen bg-[#1f1f1f] text-black font-mono flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center bg-[#cdd8c0] px-6 py-3 border-b border-gray-400">
        <Link to="/globe" className="bg-black text-white px-4 py-2 rounded-md font-bold hover:shadow-lg transition">EXPLORE</Link>
        <div className="relative" onClick={() => setOpen(!open)}>
          <img src={user?.user_metadata?.avatar_url || "/default-avatar.png"} alt="User Avatar" className="w-10 h-10 rounded-full cursor-pointer border-2 border-white" />
          {open && <UserDropdown name={user?.user_metadata?.full_name || "User"} onClose={() => setOpen(false)} />}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav using Search Params */}
        <nav className="w-20 bg-[#b7c7a8] flex flex-col items-center py-6 gap-4">
          {[ { id: "home", icon: Save }, { id: "storage", icon: Database } ].map(({ id, icon: Icon }) => (
            <button 
              key={id} 
              onClick={() => setSearchParams({ tab: id })} 
              className={`p-4 rounded-xl cursor-pointer transition ${tab === id ? "bg-white shadow-md" : "hover:bg-[#a6b697]"}`}
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 bg-[#e5e5e5] p-8 overflow-y-auto">
          {tab === "home" ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl font-black">Global Science News</h1>
              <p className="text-sm italic text-gray-500">Last updated: {newsLastUpdated}</p>
              {news.map((item, i) => <NewsItem key={i} {...item} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loadingStorage ? <p>Loading...</p> : savedEarthquakes.map(eq => (
                <div key={eq.id} className="relative group bg-white rounded-2xl border hover:shadow-lg transition">
                  <Link to={`/earthquake/${eq.id}`} className="block p-5">
                    <div className="text-3xl font-bold text-blue-700">{eq.mag?.toFixed(1)}</div>
                    <p className="font-semibold truncate pr-8">{eq.place}</p>
                  </Link>
                  
                  <button
                    onClick={(e) => handleDelete(e, eq.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer bg-white hover:bg-red-50 rounded-full"
                    title="Remove from storage"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {tab === "storage" && !loadingStorage && savedEarthquakes.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-xl">No saved earthquakes yet.</p>
              <p className="text-sm mt-2">Explore the globe and save earthquakes to see them here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}