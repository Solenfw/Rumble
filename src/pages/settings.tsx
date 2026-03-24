import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputBoxProps } from '@types';
import { useAuth } from '@contexts/authContext';
import { supabase } from '@services/supabaseClient';

// --- Reusable Components ---
const InputBox: React.FC<InputBoxProps> = ({ label, value, onChange, multiline }) => {
  return (
    <div className="mb-6 border border-gray-300 rounded-xl p-4 transition-all focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500">
      <label className="block text-gray-700 text-sm font-bold mb-1">{label}</label>
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

const EditProfileView = ({ formData, handleInputChange, handleAvatarChange, fileInputRef, onChange }: any) => (
  <div className="max-w-md mx-auto">
    {/* Avatar Group */}
    <div className="flex items-center gap-4 mb-8">
      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 shrink-0">
        <img
          src={formData.avatarUrl}
          alt="Your profile picture"
          className="w-full h-full object-cover"
        />
      </div>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={onChange} className="hidden" />
      <button onClick={handleAvatarChange} className="bg-[#94a87d] text-black px-4 py-1 font-bold text-sm rounded shadow-sm hover:bg-[#83966c] transition-colors">
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
  </div>
);


const AccountManagementView = () => {
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [visible, setVisible] = useState(false);

  const handlePasswordChange = async () => {
    setPwError('');
    if (newPassword !== confirmPassword) return setPwError('Passwords do not match.');
    if (newPassword.length < 6) return setPwError('Minimum 6 characters.');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return setPwError(error.message);
    setPwSuccess(true);
    setShowPasswordForm(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    // requires server-side admin call — flag for later
    console.warn('Account deletion requires server-side implementation.');
  };

  return (
    <div className="max-w-md mx-auto font-sans text-gray-900 pb-8">
      <div className="mb-10">
        <h1 className="text-[28px] font-bold mb-2 tracking-tight">Account management</h1>
        <p className="text-[15px] text-gray-800">Make changes to your personal information or account type.</p>
      </div>

      {/* Your account */}
      <div className="mb-12">
        <h2 className="text-lg font-bold mb-4">Your account</h2>
        <div className="mb-6">
          <div className="border border-gray-400 rounded-2xl px-4 py-3">
            <label className="block text-xs text-gray-800 mb-1">Email - Private</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full bg-transparent outline-none text-[15px]"
              readOnly
            />
          </div>
          <div className="mt-2 inline-flex items-center bg-[#b8f5d0] text-[#0a6c38] text-[13px] font-semibold px-2 py-1 rounded-md">
            Confirmed
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-[15px]">Password</span>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-[#e9e9e9] hover:bg-[#d8d8d8] text-gray-900 font-semibold py-3 px-5 rounded-full text-[15px] transition-colors"
            >
              {showPasswordForm ? 'Cancel' : 'Change'}
            </button>
          </div>
          {showPasswordForm && (
            <div className="space-y-3">
              {pwError && <p className="text-red-500 text-sm">{pwError}</p>}
              {pwSuccess && <p className="text-green-600 text-sm">Password updated successfully.</p>}
              <div className="relative">
                <input
                  type= {visible? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type= {visible? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                onClick={handlePasswordChange}
                className="w-full bg-[#4a6d7c] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#5a7d8c] transition-colors"
              >
                Update password
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Deactivation */}
      <div>
        <h2 className="text-lg font-bold mb-4">Deactivation</h2>
        <div className="flex items-center justify-between gap-4 p-4 border border-red-200 rounded-xl">
          <div>
            <h3 className="font-bold text-[15px]">Delete your data and account</h3>
            <p className="text-[13px] text-gray-500 mt-1">Permanently deletes everything associated with your account.</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-3 px-5 rounded-full text-[14px] whitespace-nowrap transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


const PrivacyDataView = () => {
  const [analytics, setAnalytics] = useState(false);

  return (
    <div className="max-w-md mx-auto font-sans text-gray-900 p-4">
      <div className="mb-10">
        <h1 className="text-[28px] font-bold mb-2 tracking-tight">Privacy and Data</h1>
        <p className="text-[15px] text-gray-800">Manage your privacy settings and data.</p>
      </div>

      {/* Data Collection */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Data Collection</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <p className="font-semibold text-sm">Analytics</p>
              <p className="text-xs text-gray-500">Help us improve by sharing usage data</p>
            </div>
            <input type="checkbox" checked={analytics} onChange={() => setAnalytics(!analytics)} className="w-4 h-4 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* What we collect */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">What We Collect</h2>
        <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm text-gray-600">
          <p>✓ Google account email and profile picture</p>
          <p>✓ Saved earthquake data</p>
          <p>✗ No location data</p>
          <p>✗ No payment information</p>
        </div>
      </div>

      {/* Download / Delete */}
      <div>
        <h2 className="text-lg font-bold mb-4">Your Data</h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            Download my data
          </button>
          <button className="w-full text-left px-4 py-3 border border-red-200 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
            Delete all my data
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Settings Component ---

const Settings: React.FC = () => {
  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  const userName = user?.user_metadata?.full_name || '';
  const about = user?.user_metadata?.about || '';

  const navigate = useNavigate();
  const[activeMenu, setActiveMenu] = useState('Edit Profile');
  const [formData, setFormData] = useState({
    username: userName,
    about: about,
    avatarUrl: avatarUrl,
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const menuItems =['Edit Profile', 'Account management', 'Privacy and Data'];

  const handleAvatarChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = async () => {
    const {error} = await supabase.auth.updateUser({
      data: {
        full_name: formData.username,
        avatar_url: formData.avatarUrl,
        about: formData.about
      }
    });
    if (error) {
      console.error('Error updating user:', error);
      alert('Failed to update profile. Please try again.');
    } else {
      navigate(-1);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'Edit Profile':
        return <EditProfileView 
                formData={formData} 
                handleInputChange={handleInputChange} 
                avatarUrl={avatarUrl} 
                handleAvatarChange={handleAvatarChange}
                fileInputRef={fileInputRef}
                onChange={handleFileSelect}
                />;
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