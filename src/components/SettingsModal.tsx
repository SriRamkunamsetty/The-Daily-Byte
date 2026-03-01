import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Palette, Bell, Bookmark, Globe, Shield, Camera, Check, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
    const { user, darkMode, toggleDark } = useApp();

    const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "account">("profile");
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Load notification preferences from localStorage
        const saved = localStorage.getItem("daily_byte_notifications");
        if (saved) {
            setNotificationsEnabled(saved === "true");
        }
    }, []);

    const handleNotificationsToggle = () => {
        const newState = !notificationsEnabled;
        setNotificationsEnabled(newState);
        localStorage.setItem("daily_byte_notifications", String(newState));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && auth.currentUser) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    setIsSaving(true);
                    await updateProfile(auth.currentUser!, { photoURL: reader.result as string });
                    setSuccessMessage("Avatar updated!");
                    setTimeout(() => setSuccessMessage(""), 3000);
                } catch (error) {
                    console.error("Error updating avatar:", error);
                } finally {
                    setIsSaving(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!auth.currentUser) return;
        setIsSaving(true);
        try {
            await updateProfile(auth.currentUser, { displayName });
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error updating profile:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Settings</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                            {/* Sidebar Tabs */}
                            <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-white/10 p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors shrink-0 ${activeTab === "profile" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
                                >
                                    <User size={18} />
                                    Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab("preferences")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors shrink-0 ${activeTab === "preferences" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
                                >
                                    <Palette size={18} />
                                    Preferences
                                </button>
                                <button
                                    onClick={() => setActiveTab("account")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors shrink-0 ${activeTab === "account" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
                                >
                                    <Shield size={18} />
                                    Account
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 p-6 overflow-y-auto min-h-[50vh]">
                                {activeTab === "profile" && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <h3 className="text-lg font-semibold text-white">Public Profile</h3>

                                        <div className="flex items-center gap-6">
                                            <div className="relative group">
                                                <img
                                                    src={user?.photoURL || "https://api.dicebear.com/9.x/notionists/svg?seed=User"}
                                                    alt="Avatar"
                                                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/50 bg-slate-800"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Camera size={20} className="text-white" />
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-300">Profile Picture</p>
                                                <p className="text-xs text-slate-500 mt-1">Recommended size: 256x256px.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={user?.email || ""}
                                                    disabled
                                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 text-sm cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex items-center gap-4">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isSaving && <Loader2 size={16} className="animate-spin" />}
                                                Save Changes
                                            </button>
                                            {successMessage && (
                                                <span className="text-sm text-emerald-400 flex items-center gap-1">
                                                    <Check size={16} /> {successMessage}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "preferences" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                                <div className="flex items-center gap-3">
                                                    <Palette className="text-blue-400" size={20} />
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Dark Mode</p>
                                                        <p className="text-xs text-slate-400">Toggle dark and light themes</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={toggleDark}
                                                    className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-blue-500' : 'bg-slate-600'}`}
                                                >
                                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                                <div className="flex items-center gap-3">
                                                    <Bell className="text-rose-400" size={20} />
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Push Notifications</p>
                                                        <p className="text-xs text-slate-400">Receive breaking news alerts</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleNotificationsToggle}
                                                    className={`w-11 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-blue-500' : 'bg-slate-600'}`}
                                                >
                                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-4">Localization</h3>
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                                <div className="flex items-center gap-3">
                                                    <Globe className="text-emerald-400" size={20} />
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Language</p>
                                                        <p className="text-xs text-slate-400">Interface language</p>
                                                    </div>
                                                </div>
                                                <select className="bg-slate-900 border border-slate-700 text-sm rounded-lg text-white px-3 py-1.5 outline-none">
                                                    <option value="en">English (US)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "account" && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <h3 className="text-lg font-semibold text-white">Account Management</h3>

                                        <div className="space-y-3">
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    document.getElementById('saved-articles')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 text-left">
                                                    <Bookmark className="text-amber-400" size={20} />
                                                    <div>
                                                        <p className="text-sm font-medium text-white">View Saved Articles</p>
                                                        <p className="text-xs text-slate-400">Access your bookmarks collection</p>
                                                    </div>
                                                </div>
                                            </button>

                                            <a
                                                href="/privacy"
                                                target="_blank"
                                                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 text-left">
                                                    <Shield className="text-indigo-400" size={20} />
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Privacy Policy</p>
                                                        <p className="text-xs text-slate-400">Read our data and privacy guarantees</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
