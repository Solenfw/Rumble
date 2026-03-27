import { Eye, EyeOff, Download, Trash2, ShieldAlert } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputBoxProps } from '@types';
import { useAuth } from '@contexts/authContext';
import { supabase } from '@services/supabaseClient';
import { useAppStore } from '../store/useAppStore';

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

// --- View 1: Edit Profile (Unchanged) ---
const EditProfileView = ({ formData, handleInputChange, handleAvatarChange, fileInputRef, onChange }: any) => (
  <div className="max-w-md mx-auto">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 shrink-0">
        <img
          src={formData.avatarUrl}
          alt="Your profile picture"
          className="w-full h-full object-cover"
        />
      </div>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={onChange} className="hidden" />
      <button onClick={handleAvatarChange} className="bg-[#94a87d] text-black px-4 py-1 font-bold text-sm rounded shadow-sm hover:bg-[#83966c] transition-colors cursor-pointer">
        CHANGE
      </button>
    </div>
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

// --- View 2: Account Management ---
const AccountManagementView = () => {
  const { user } = useAuth();
  const[showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const[pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const[visible, setVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordChange = async () => {
    setPwError('');
    setPwSuccess(false);
    
    if (newPassword !== confirmPassword) return setPwError('Passwords do not match.');
    if (newPassword.length < 6) return setPwError('Minimum 6 characters.');
    
    setIsUpdating(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdating(false);

    if (error) return setPwError(error.message);
    
    setPwSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setShowPasswordForm(false), 2000); // Auto-close after 2s
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete your account? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    
    try {
      // NOTE: Supabase requires an RPC call (or Edge Function) to let a user delete themselves securely.
      // You must create a Postgres function named 'delete_user_account' in your Supabase SQL editor.
      const { error } = await supabase.rpc('delete_user_account');
      if (error) throw error;
      
      // If successful, sign them out.
      await supabase.auth.signOut();
      window.location.href = '/'; 
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      alert('Could not delete account. Ensure your database RPC is configured properly.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto font-sans text-gray-900 pb-8">
      <div className="mb-10">
        <h1 className="text-[28px] font-bold mb-2 tracking-tight">Account management</h1>
        <p className="text-[15px] text-gray-800">Make changes to your personal information or account type.</p>
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-bold mb-4">Your account</h2>
        <div className="mb-6">
          <div className="border border-gray-400 rounded-2xl px-4 py-3">
            <label className="block text-xs text-gray-800 mb-1">Email - Private</label>
            <input type="email" value={user?.email || ''} className="w-full bg-transparent outline-none text-[15px]" readOnly />
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
              onClick={() => { setShowPasswordForm(!showPasswordForm); setPwSuccess(false); setPwError(''); }}
              className="bg-[#e9e9e9] hover:bg-[#d8d8d8] text-gray-900 font-semibold py-2 px-5 rounded-full text-[14px] transition-colors cursor-pointer"
            >
              {showPasswordForm ? 'Cancel' : 'Change'}
            </button>
          </div>
          {showPasswordForm && (
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              {pwError && <p className="text-red-500 text-sm font-medium">{pwError}</p>}
              {pwSuccess && <p className="text-emerald-600 text-sm font-medium">Password updated successfully.</p>}
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#94a87d]"
                />
                <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                  {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#94a87d]"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={isUpdating}
                className="w-full bg-[#4a6d7c] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#385360] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Update password'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
          <ShieldAlert size={20} /> Danger Zone
        </h2>
        <div className="flex items-center justify-between gap-4 p-4 border border-red-200 bg-red-50/50 rounded-xl">
          <div>
            <h3 className="font-bold text-[15px] text-red-900">Delete Account</h3>
            <p className="text-[13px] text-red-700/80 mt-1">Permanently deletes your account and all data.</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2.5 px-5 rounded-lg text-[14px] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- View 3: Privacy & Data ---
const PrivacyDataView = () => {
  const { user } = useAuth();
  const { clearSavedEarthquakes } = useAppStore(); // Connect to Zustand store
  const [analytics, setAnalytics] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const[isDeletingData, setIsDeletingData] = useState(false);

  // Sync analytics state with user_metadata on load
  useEffect(() => {
    if (user?.user_metadata?.analytics_enabled !== undefined) {
      setAnalytics(user.user_metadata.analytics_enabled);
    }
  }, [user]);

  // Auto-save analytics preference to Supabase immediately when toggled
  const handleToggleAnalytics = async () => {
    const newValue = !analytics;
    setAnalytics(newValue);
    await supabase.auth.updateUser({
      data: { analytics_enabled: newValue }
    });
  };

  const handleDownloadData = async () => {
    setIsDownloading(true);
    try {
      const { data, error } = await supabase
        .from('earthquakes')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      // Generate a JSON file and force download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `earthquake_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Failed to download data.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteData = async () => {
    if (!window.confirm("Are you sure? This will wipe all your saved earthquakes. This cannot be undone.")) return;
    
    setIsDeletingData(true);
    try {
      const { error } = await supabase
        .from('earthquakes')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;
      
      // Instantly clear the UI using Zustand
      clearSavedEarthquakes();
      alert('All saved earthquake data has been deleted.');
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data.');
    } finally {
      setIsDeletingData(false);
    }
  };

  return (
    <div className="max-w-md mx-auto font-sans text-gray-900 pb-8">
      <div className="mb-10">
        <h1 className="text-[28px] font-bold mb-2 tracking-tight">Privacy and Data</h1>
        <p className="text-[15px] text-gray-800">Manage your privacy settings and personal data.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Data Collection</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded-xl">
            <div>
              <p className="font-semibold text-[15px]">Analytics</p>
              <p className="text-[13px] text-gray-500 mt-1">Help us improve by sharing usage data</p>
            </div>
            <input 
              type="checkbox" 
              checked={analytics} 
              onChange={handleToggleAnalytics} 
              className="w-5 h-5 accent-[#4a6d7c] cursor-pointer" 
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">What We Collect</h2>
        <div className="p-5 border border-gray-200 rounded-xl space-y-3 text-[14px] text-gray-700 bg-white">
          <p className="flex items-center gap-2">✅ Google account email and profile picture</p>
          <p className="flex items-center gap-2">✅ Saved earthquake data</p>
          <p className="flex items-center gap-2 text-gray-400">❌ No location data</p>
          <p className="flex items-center gap-2 text-gray-400">❌ No payment information</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Your Data</h2>
        <div className="space-y-3">
          <button 
            onClick={handleDownloadData}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-300 rounded-xl text-[14px] font-bold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download size={18} />
            {isDownloading ? 'Packaging Data...' : 'Download my data (JSON)'}
          </button>
          
          <button 
            onClick={handleDeleteData}
            disabled={isDeletingData}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border border-red-200 rounded-xl text-[14px] font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={18} />
            {isDeletingData ? 'Deleting...' : 'Delete all my saved earthquakes'}
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
  const [activeMenu, setActiveMenu] = useState('Edit Profile');
  const[isSavingProfile, setIsSavingProfile] = useState(false);
  const [formData, setFormData] = useState({
    username: userName,
    about: about,
    avatarUrl: avatarUrl,
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const menuItems =['Edit Profile', 'Account management', 'Privacy and Data'];

  const handleAvatarChange = () => fileInputRef.current?.click();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Only saves Profile Information. Password and Data logic is handled in their respective views.
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: formData.username,
        avatar_url: formData.avatarUrl,
        about: formData.about
      }
    });
    setIsSavingProfile(false);

    if (error) {
      console.error('Error updating user:', error);
      alert('Failed to update profile. Please try again.');
    } else {
      navigate(-1);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'Edit Profile':
        return <EditProfileView 
                formData={formData} 
                handleInputChange={handleInputChange} 
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] min-h-150">
        
        {/* Header */}
        <div className="p-5 text-gray-500 text-[15px] border-b border-gray-100 font-bold shrink-0 uppercase tracking-wider">
          Settings
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 p-8 border-r border-gray-100 shrink-0 overflow-y-auto bg-gray-50/50">
            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveMenu(item)}
                  className={`text-left font-bold text-lg transition-colors cursor-pointer ${
                    activeMenu === item
                      ? 'text-black border-b-2 border-black w-fit pb-1'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content */}
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
            {renderContent()}
          </div>
        </div>

        {/* Bottom Actions - Only show global "SAVE" button if editing profile */}
        <div className="border-t border-gray-200 p-5 flex justify-end gap-4 bg-gray-50">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 font-bold rounded-lg shadow-sm hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {activeMenu === 'Edit Profile' ? 'CANCEL' : 'CLOSE'}
          </button>
          
          {activeMenu === 'Edit Profile' && (
            <button
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="bg-[#94a87d] text-white px-8 py-2.5 font-bold rounded-lg shadow-sm hover:bg-[#83966c] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSavingProfile ? 'SAVING...' : 'SAVE'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;