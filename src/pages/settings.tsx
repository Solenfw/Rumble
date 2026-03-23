import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface InputBoxProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ label, value, onChange, multiline }) => {
  return (
    <div className="mb-6 border border-gray-300 rounded-xl p-4 transition-all focus-within:border-gray-500">
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

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    about: '',
    email: '',
  });

  const [activeMenu, setActiveMenu] = useState('Edit Profile');

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

  const menuItems = [
    'Edit Profile',
    'Account management',
    'Security',
    'Privacy and Data',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl flex flex-col overflow-hidden min-h-150">
        {/* Header (Optional Title) */}
        <div className="p-4 text-gray-500 text-sm border-b border-transparent">
          setting
        </div>

        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="w-64 p-8 border-r border-transparent">
            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveMenu(item)}
                  className={`text-left font-bold text-lg transition-colors ${
                    activeMenu === item
                      ? 'text-black border-b-2 border-black w-fit'
                      : 'text-black hover:text-gray-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content */}
          <div className="flex-1 p-8 pt-4 overflow-y-auto">
            <div className="max-w-md mx-auto">
              {/* Avatar Group */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
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
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 p-4 flex justify-end gap-4">
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
      </div>
    </div>
  );
};

export default Settings;
