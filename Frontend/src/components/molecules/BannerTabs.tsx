import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { name: "Banner One", path: "/banners/banner-one" },
  { name: "Banner Two", path: "/banners/banner-two" },
];

const BannerTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab");


  useEffect(() => {
    if (!activeTab) {
      const defaultTab = tabs[0].path.split("/").pop();
      navigate(`${tabs[0].path}?tab=${defaultTab}`, { replace: true });
    }
  }, [activeTab, navigate]);


  const handleTabClick = (tabPath: string) => {
    const tabName = tabPath.split("/").pop();

    const params = new URLSearchParams(location.search);
    params.set("tab", tabName!);

    navigate(`${tabPath}?${params.toString()}`);
  };

  return (
    <div className=" mb-3">
      <nav className="flex space-x-4">
        {tabs.map((tab) => {
          const tabKey = tab.path.split("/").pop();
          const isActive = activeTab === tabKey;

          return (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.path)}
              className={`px-4 py-2 text-md font-bold transition-all
                ${isActive
                  ? " text-amber-500 border-b border-amber-500"
                  : "text-gray-600  hover:text-amber-500"
                }`}
            >
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BannerTabs;