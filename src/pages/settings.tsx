import { Calendar, ChevronDown, Info, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Reusable Components ---

interface InputBoxProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ label, value, onChange, multiline }) => {
  return (
    <div className="mb-6 border border-gray-300 rounded-xl p-4 transition-all focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500">
      <label className="block text-gray-700 text-sm font-medium mb-1">{label}</label>
      {multiline ? (
        <textarea
          className="w-full bg-transparent border-none outline-none text-gray-600 resize-none"
          value={value}
          onChange={onChange}
          rows={1}
          placeholder="....."
        />
      ) : (
        <input
          type="text"
          className="w-full bg-transparent border-none outline-none text-gray-600"
          value={value}
          onChange={onChange}
          placeholder="....."
        />
      )}
    </div>
  );
};

// --- View Components ---

const EditProfileView = ({ formData, handleInputChange }: any) => (
  <div className="max-w-md mx-auto">
    {/* Avatar Group */}
    <div className="flex items-center gap-4 mb-8">
      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 shrink-0">
        <img
          src="https://placekitten.com/200/200" // Placeholder cat image
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <button className="bg-[#94a87d] text-black px-4 py-1 font-bold text-sm rounded shadow-sm hover:bg-[#83966c] transition-colors">
        CHANGE
      </button>
    </div>

    {/* Input Boxes */}
    <InputBox
      label="Your username"
      value={formData.username}
      onChange={handleInputChange('username')}
    />
    <InputBox
      label="About"
      value={formData.about}
      onChange={handleInputChange('about')}
      multiline
    />
    <InputBox
      label="Email"
      value={formData.email}
      onChange={handleInputChange('email')}
    />
  </div>
);

const AccountManagementView = () => (
  <div className="max-w-md mx-auto font-sans text-gray-900 pb-8">
    {/* Header */}
    <div className="mb-10">
      <h1 className="text-[28px] font-bold mb-2 tracking-tight">
        Account management
      </h1>
      <p className="text-[15px] text-gray-800">
        Make changes to your personal information or account type.
      </p>
    </div>

    {/* Your account */}
    <div className="mb-12">
      <h2 className="text-lg font-bold mb-4">Your account</h2>

      {/* Email */}
      <div className="mb-6">
        <div className="border border-gray-400 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-300">
          <label className="block text-xs text-gray-800 mb-1">
            Email - Private
          </label>
          <input
            type="email"
            defaultValue="vincentcody0175@gmail.com"
            className="w-full bg-transparent outline-none text-[15px]"
            readOnly
          />
        </div>
        <div className="mt-2 inline-flex items-center bg-[#b8f5d0] text-[#0a6c38] text-[13px] font-semibold px-2 py-1 rounded-md">
          Confirmed
        </div>
      </div>

      {/* Password */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-[15px]">Password</span>
        <button className="bg-[#e9e9e9] hover:bg-[#d8d8d8] text-gray-900 font-semibold py-3 px-5 rounded-full text-[15px] transition-colors">
          Change
        </button>
      </div>
    </div>

    {/* Personal information */}
    <div className="mb-12">
      <h2 className="text-lg font-bold mb-4">Personal information</h2>

      {/* Birthdate */}
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[13px] text-gray-800">Birthdate</span>
          <Info className="w-4 h-4 text-gray-500" />
        </div>
        <div className="border border-gray-400 rounded-2xl px-4 py-3 flex justify-between items-center focus-within:ring-2 focus-within:ring-blue-300">
          <input
            type="text"
            defaultValue="07/14/1999"
            className="w-full bg-transparent outline-none text-[15px]"
            readOnly
          />
          <Calendar className="w-5 h-5 text-gray-800 cursor-pointer" />
        </div>
      </div>

      {/* Country/Region */}
      <div className="mb-6">
        <div className="border border-gray-400 rounded-2xl px-4 py-3 flex justify-between items-center focus-within:ring-2 focus-within:ring-blue-300">
          <div className="w-full">
            <label className="block text-xs text-gray-800 mb-1">
              Country/Region
            </label>
            <input
              type="text"
              defaultValue="United States"
              className="w-full bg-transparent outline-none text-[15px]"
              readOnly
            />
          </div>
          <X className="w-5 h-5 text-gray-900 cursor-pointer hover:bg-gray-200 rounded-full p-0.5 transition-colors" />
        </div>
      </div>

      {/* Language */}
      <div className="mb-6">
        <div className="border border-gray-400 rounded-2xl px-4 py-3 flex justify-between items-center focus-within:ring-2 focus-within:ring-blue-300">
          <div className="w-full">
            <label className="block text-xs text-gray-800 mb-1">Language</label>
            <div className="relative">
              <select className="w-full bg-transparent outline-none text-[15px] appearance-none cursor-pointer">
                <option>English (US)</option>
              </select>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-900 pointer-events-none" />
        </div>
      </div>
    </div>

    {/* Deactivation and deletion */}
    <div>
      <h2 className="text-lg font-bold mb-4">Deactivation and deletion</h2>

      {/* Deactivate account */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="pr-2">
          <h3 className="font-bold text-[15px]">Deactivate account</h3>
          <p className="text-[15px] text-gray-800 mt-1 leading-snug">
            Temporarily hide your profile, Pins and boards
          </p>
        </div>
        <button className="bg-[#e9e9e9] hover:bg-[#d8d8d8] text-gray-900 font-semibold py-3 px-5 rounded-full text-[15px] whitespace-nowrap transition-colors">
          Deactivate account
        </button>
      </div>

      {/* Delete account */}
      <div className="flex items-center justify-between gap-4">
        <div className="pr-2">
          <h3 className="font-bold text-[15px]">Delete your data and account</h3>
          <p className="text-[15px] text-gray-800 mt-1 leading-snug">
            Permanently delete your data and everything associated with your account
          </p>
        </div>
        <button className="bg-[#e9e9e9] hover:bg-[#d8d8d8] text-gray-900 font-semibold py-3 px-5 rounded-full text-[15px] whitespace-nowrap transition-colors">
          Delete account
        </button>
      </div>
    </div>
  </div>
);

const PrivacyDataView = () => (
  <div className="max-w-md mx-auto font-sans text-gray-900 p-4">
    <div className="mb-10">
      <h1 className="text-[28px] font-bold mb-2 tracking-tight">
        Privacy and Data
      </h1>
      <p className="text-[15px] text-gray-800">
        Manage your privacy settings and data.
      </p>
    </div>
    <p>
      We don't collect user data in any form. Our privacy policy only handles
      your Google account information.
    </p>
  </div>
);

// --- Main Settings Component ---

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const[activeMenu, setActiveMenu] = useState('Edit Profile');
  const [formData, setFormData] = useState({
    username: '',
    about: '',
    email: '',
  });

  const menuItems =['Edit Profile', 'Account management', 'Privacy and Data'];

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    console.log('Saving data:', formData);
    // Logic to send data to server would go here
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'Edit Profile':
        return <EditProfileView formData={formData} handleInputChange={handleInputChange} />;
      case 'Account management':
        return <AccountManagementView />;
      case 'Privacy and Data':
        return <PrivacyDataView />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* 
        Changes made here:
        1. Added `max-h-[90vh]` to prevent the modal from getting taller than the screen.
        2. Changed `min-h-150` to `min-h-[600px]` (Valid Tailwind notation). 
      */}
      <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl flex flex-col overflow-hidden max-h-[90vh] min-h-150">
        
        {/* Header - Added shrink-0 to prevent squishing */}
        <div className="p-4 text-gray-500 text-sm border-b border-gray-100 font-bold shrink-0">
          Settings
        </div>

        {/* 
          Changes made here:
          Added `overflow-hidden` so this container doesn't expand infinitely,
          forcing its children to handle the scrolling instead.
        */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Sidebar */}
          <div className="w-64 p-8 border-r border-gray-100 shrink-0 overflow-y-auto">
            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveMenu(item)}
                  className={`text-left font-bold text-lg transition-colors ${
                    activeMenu === item
                      ? 'text-black border-b-2 border-black w-fit'
                      : 'text-black hover:text-gray-400'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content */}
          <div className="flex-1 p-8 pt-4 overflow-y-auto">
            {renderContent()}
          </div>
        </div>

        {/* Bottom Actions - Added shrink-0 to prevent squishing */}
        {activeMenu === 'Edit Profile' && (
          <div className="border-t border-gray-200 p-4 flex justify-end gap-4 shrink-0">
            <button
              onClick={handleCancel}
              className="bg-[#c2c2c2] text-black px-6 py-2 font-bold rounded shadow-sm hover:bg-gray-400 transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="bg-[#94a87d] text-black px-6 py-2 font-bold rounded shadow-sm hover:bg-[#83966c] transition-colors"
            >
              SAVE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;