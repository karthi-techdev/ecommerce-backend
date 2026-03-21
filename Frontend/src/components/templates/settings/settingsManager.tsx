import React from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. Import this
import GenerateSettings from './generatSetting';
import MailConfiguration from './mailConfiguration';
import LogoBranding from './logoBranding';
import SecuritySettings from './securitySettings';

const SettingsManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTab = searchParams.get('tab') || 'general';

  const tabs = [
    { id: 'general', label: 'General Setting' },
    { id: 'mail', label: 'Mail Configuration' },
    { id: 'logo', label: 'Logo & Branding' },
    { id: 'security', label: 'Security Settings' } 
  ];

  // 4. Update the URL when a tab is clicked
  const handleTabChange = (id: string) => {
    setSearchParams({ tab: id });
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)} // Change URL on click
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? ' text-amber-500 border-b border-amber-500  scale-105' 
                : ' text-gray-600 ' 
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full">
        {activeTab === 'general' && <GenerateSettings isTabbed={true} />}
        {activeTab === 'mail' && <MailConfiguration isTabbed={true} />}
        {activeTab === 'logo' && <LogoBranding isTabbed={true} />}
        {activeTab === 'security' && <SecuritySettings isTabbed={true} />}
      </div>
    </div>
  );
};

export default SettingsManager;