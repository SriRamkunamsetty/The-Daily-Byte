import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";

interface AvatarModalProps {
    open: boolean;
    onClose: () => void;
}

const DEFAULT_AVATARS = [
    { id: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4" },
    { id: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Aneka&backgroundColor=ffdfbf" },
    { id: "robot", url: "https://api.dicebear.com/9.x/bottts/svg?seed=Robot&backgroundColor=c0aede" },
    { id: "minimal", url: "https://api.dicebear.com/9.x/initials/svg?seed=User&backgroundColor=1e293b" },
    { id: "anime", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Destiny&backgroundColor=b6e3f4" },
];

export default function AvatarModal({ open, onClose }: AvatarModalProps) {
    const { user } = useApp();
    const [selectedAvatar, setSelectedAvatar] = useState<string>(user?.photoURL || DEFAULT_AVATARS[3].url);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;
        setIsSaving(true);
        setSuccess(false);

        try {
            await updateProfile(auth.currentUser, { photoURL: selectedAvatar });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
                // Force reload to update navbar icon instantly in all component trees
                window.location.reload();
            }, 800);
        } catch (error) {
            console.error("Error saving avatar:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Customize Avatar</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Preview Area */}
                        <div className="flex flex-col items-center justify-center mb-8">
                            <div className="relative group">
                                <img
                                    src={selectedAvatar}
                                    alt="Avatar Preview"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/30 bg-slate-800 shadow-xl"
                                />
                            </div>
                            <p className="text-sm text-slate-400 mt-4">Avatar Preview</p>
                        </div>

                        <div className="space-y-6">
                            {/* Upload Button */}
                            <div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm font-medium"
                                >
                                    <Upload size={16} />
                                    Upload Custom Image
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>

                            {/* Default Avatars */}
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    Or select a default
                                </p>
                                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                                    {DEFAULT_AVATARS.map((avatar) => (
                                        <button
                                            key={avatar.id}
                                            onClick={() => setSelectedAvatar(avatar.url)}
                                            className={`relative shrink-0 rounded-full transition-all ${selectedAvatar === avatar.url ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={avatar.url} alt={avatar.id} className="w-12 h-12 rounded-full object-cover bg-slate-800" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl bg-transparent text-slate-400 hover:text-white font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || selectedAvatar === user?.photoURL}
                                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : success ? <Check size={16} /> : "Save Avatar"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
