import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, Loader2, Trash2, User, Image as ImageIcon, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import Cropper from "react-easy-crop";

interface AvatarModalProps {
    open: boolean;
    onClose: () => void;
}

const DEFAULT_AVATARS = [
    { id: "male", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4" },
    { id: "female", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Aneka&backgroundColor=ffdfbf" },
    { id: "robot", url: "https://api.dicebear.com/9.x/bottts/svg?seed=Robot&backgroundColor=c0aede" },
    { id: "anime", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Destiny&backgroundColor=b6e3f4" },
    { id: "pixel", url: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Pixel&backgroundColor=4f46e5" },
    { id: "gradient", url: "https://api.dicebear.com/9.x/shapes/svg?seed=Abstract&backgroundColor=000000" },
    { id: "minimal", url: "https://api.dicebear.com/9.x/initials/svg?seed=User&backgroundColor=1e293b" },
    { id: "cat", url: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Meow&backgroundColor=fcd34d" },
    { id: "ai", url: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=AI&backgroundColor=10b981" },
    { id: "tech", url: "https://api.dicebear.com/9.x/shapes/svg?seed=Tech&backgroundColor=ec4899" },
];

export default function AvatarModal({ open, onClose }: AvatarModalProps) {
    const { userAvatar, updateUserAvatar } = useApp();
    const [activeTab, setActiveTab] = useState<"upload" | "avatars" | "preview">("upload");

    // State for upload & crop
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Final preview state
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(userAvatar || DEFAULT_AVATARS[6].url);

    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setPreviewAvatar(userAvatar || DEFAULT_AVATARS[6].url);
            setImageSrc(null);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
            setActiveTab("upload"); // default to upload on open
        }
    }, [open, userAvatar]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                setActiveTab("upload"); // Stays on upload tab to show cropper
            };
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please select a valid JPG or PNG image.");
        }
        // Reset the file input so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onCropComplete = useCallback((_croppedArea: any, croppedPixels: any) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        canvas.width = 256;
        canvas.height = 256;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            256,
            256
        );

        return canvas.toDataURL("image/jpeg", 0.9);
    };

    const confirmCrop = async () => {
        if (imageSrc && croppedAreaPixels) {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                setPreviewAvatar(croppedImage);
                setImageSrc(null); // Close cropper UI
                setActiveTab("preview"); // Switch to preview tab automatically
            }
        }
    };

    const handleSelectDefault = (url: string) => {
        setPreviewAvatar(url);
        setActiveTab("preview"); // Jump to preview to see it larger and save
    };

    const handleRemoveAvatar = () => {
        setPreviewAvatar(DEFAULT_AVATARS[6].url); // minimal default
        setActiveTab("preview");
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSuccess(false);

        try {
            if (previewAvatar) {
                // Sync local storage / AppContext immediately for responsive UI
                updateUserAvatar(previewAvatar);

                // Sync to firebase auth
                if (auth.currentUser) {
                    await updateProfile(auth.currentUser, { photoURL: previewAvatar });
                }
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 500);
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
                    className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 sm:bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal - Full screen mobile, centered rounded desktop */}
                    <motion.div
                        className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-xl bg-slate-900 sm:border sm:border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0 bg-slate-900/50 backdrop-blur z-10">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <User className="text-blue-400" size={20} />
                                Customize Avatar
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        {!imageSrc && (
                            <div className="flex border-b border-white/5 shrink-0 bg-slate-900 px-2 overflow-x-auto no-scrollbar">
                                <button
                                    onClick={() => setActiveTab("upload")}
                                    className={`flex-1 min-w-[100px] py-3.5 text-sm font-medium text-center border-b-2 transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === "upload" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
                                >
                                    <Upload size={16} />
                                    Upload
                                </button>
                                <button
                                    onClick={() => setActiveTab("avatars")}
                                    className={`flex-1 min-w-[100px] py-3.5 text-sm font-medium text-center border-b-2 transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === "avatars" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
                                >
                                    <Sparkles size={16} />
                                    Avatars
                                </button>
                                <button
                                    onClick={() => setActiveTab("preview")}
                                    className={`flex-1 min-w-[100px] py-3.5 text-sm font-medium text-center border-b-2 transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === "preview" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-200"}`}
                                >
                                    <ImageIcon size={16} />
                                    Preview
                                </button>
                            </div>
                        )}

                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto relative bg-slate-900/30">
                            {/* CROPPER VIEW */}
                            {imageSrc && (
                                <div className="flex flex-col p-4 sm:p-5 bg-slate-900 min-h-[60vh] h-full">
                                    <div className="relative flex-1 bg-black rounded-xl overflow-hidden min-h-[40vh] sm:min-h-[300px]">
                                        <Cropper
                                            image={imageSrc}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            cropShape="round"
                                            showGrid={false}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                        />
                                    </div>
                                    <div className="mt-4 shrink-0 px-2 py-1">
                                        <p className="text-center text-xs text-slate-400 mb-2">Drag to pan. Pinch or scroll to zoom.</p>
                                    </div>
                                    <div className="mt-2 shrink-0 flex gap-3 pb-2">
                                        <button
                                            onClick={() => setImageSrc(null)}
                                            className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors"
                                        >
                                            Cancel Crop
                                        </button>
                                        <button
                                            onClick={confirmCrop}
                                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors"
                                        >
                                            Confirm Crop
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* UPLOAD TAB */}
                            {!imageSrc && activeTab === "upload" && (
                                <div className="p-6 h-full flex flex-col items-center justify-center min-h-[40vh]">
                                    <div className="w-full max-w-sm space-y-6">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Upload size={28} />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Upload Profile Image</h3>
                                            <p className="text-sm text-slate-400">Choose a clear photo for your account profile. It will be cropped to a circle.</p>
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-2xl bg-slate-800/50 border-2 border-slate-700 hover:border-blue-500 border-dashed text-slate-300 hover:text-white hover:bg-slate-800 transition-all group"
                                        >
                                            <div className="p-3 bg-slate-900 rounded-full group-hover:scale-110 transition-transform">
                                                <Upload size={20} className="text-blue-400" />
                                            </div>
                                            <span className="text-sm font-medium">Click to browse files</span>
                                            <span className="text-xs text-slate-500">Supports JPG, PNG (Max 5MB)</span>
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={handleFileSelect}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* AVATARS TAB */}
                            {!imageSrc && activeTab === "avatars" && (
                                <div className="p-4 sm:p-6 h-full">
                                    <h3 className="text-sm font-medium text-slate-400 mb-4 px-1">Choose a default avatar</h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
                                        {DEFAULT_AVATARS.map((avatar) => (
                                            <button
                                                key={avatar.id}
                                                onClick={() => handleSelectDefault(avatar.url)}
                                                className={`relative aspect-square rounded-2xl transition-all overflow-hidden bg-slate-800 group ${previewAvatar === avatar.url
                                                    ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-900 scale-105 shadow-xl shadow-blue-500/20 z-10'
                                                    : 'hover:scale-105 hover:ring-2 hover:ring-slate-700 hover:z-10 shadow-lg'
                                                    }`}
                                            >
                                                <img src={avatar.url} alt={`Avatar ${avatar.id}`} className="w-full h-full object-cover p-2" />
                                                {/* Label overlay on hover/active */}
                                                <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center transition-opacity ${previewAvatar === avatar.url ? 'opacity-100' : 'opacity-0 xl:group-hover:opacity-100'}`}>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                                                        {avatar.id}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PREVIEW TAB */}
                            {!imageSrc && activeTab === "preview" && (
                                <div className="p-6 h-full flex flex-col items-center justify-center min-h-[40vh]">
                                    <div className="relative group mb-8">
                                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                        <img
                                            src={previewAvatar || DEFAULT_AVATARS[6].url}
                                            alt="Avatar Preview"
                                            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-slate-700 shadow-2xl bg-slate-800"
                                        />
                                        <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                                            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                                Preview
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">Looking Good!</h3>
                                    <p className="text-sm text-slate-400 text-center max-w-sm mb-8">
                                        This is how your avatar will appear across The Daily Byte to you and other users.
                                    </p>

                                    <button
                                        onClick={handleRemoveAvatar}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
                                    >
                                        <Trash2 size={16} />
                                        Remove & Reset Avatar
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        {!imageSrc && (
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 p-4 sm:p-5 border-t border-white/10 shrink-0 bg-slate-900 z-10">
                                <button
                                    onClick={onClose}
                                    disabled={isSaving}
                                    className="py-3 px-6 rounded-xl bg-slate-800 sm:bg-transparent hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || previewAvatar === userAvatar}
                                    className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : success ? (
                                        <>
                                            <Check size={18} />
                                            Saved!
                                        </>
                                    ) : (
                                        "Save Avatar"
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
