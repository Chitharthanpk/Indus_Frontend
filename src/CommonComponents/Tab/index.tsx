import React, { useState } from "react";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultTab?: string;
};

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [active, setActive] = useState(defaultTab || tabs[0].id);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition 
              ${
                active === tab.id
                  ? "bg-[#53825e] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
};

export default Tabs;
