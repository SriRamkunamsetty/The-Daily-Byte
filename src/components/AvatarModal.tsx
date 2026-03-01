import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import Cropper from "react-easy-crop";

interface AvatarModalProps {
    open: boolean;
    onClose: () => void;
}

const DEFAULT_AVATARS = [
    { id: "male1", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4" },
    { id: "male2", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Lucky&backgroundColor=ffb6c1" },
    { id: "female1", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Aneka&backgroundColor=ffdfbf" },
    { id: "female2", url: "https://api.dicebear.com/9.x/notionists/svg?seed=Bella&backgroundColor=c0aede" },
    { id: "robot", url: "https://api.dicebear.com/9.x/bottts/svg?seed=Robot&backgroundColor=c0aede" },
    { id: "anime", url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Destiny&backgroundColor=b6e3f4" },
    { id: "minimal", url: "https://api.dicebear.com/9.x/initials/svg?seed=User&backgroundColor=1e293b" },
    { id: "gradient", url: "https://api.dicebear.com/9.x/shapes/svg?seed=Abstract&backgroundColor=000000" },
    { id: "pixel", url: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Pixel&backgroundColor=4f46e5" },
    { id: "cat", url: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Meow&backgroundColor=fcd34d" },
];

export default function AvatarModal({ open, onClose }: AvatarModalProps) {
    const { user, userAvatar, updateUserAvatar } = useApp();
    const [activeTab, setActiveTab] = useState<"upload" | "defaults">("upload");

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
        }
    }, [open, userAvatar]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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
            }
        }
    };

    const handleRemoveAvatar = () => {
        setPreviewAvatar(DEFAULT_AVATARS[6].url); // minimal default
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;
        setIsSaving(true);
        setSuccess(false);

        try {
            if (previewAvatar) {
                // Sync local storage / AppContext
                updateUserAvatar(previewAvatar);

                // Sync to firebase auth (Firebase might reject extremely large data URIs, but 256x256 jpeg is usually fine)
                await updateProfile(auth.currentUser, { photoURL: previewAvatar });
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
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
                            <h2 className="text-lg font-bold text-white">Customize Avatar</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* If actively cropping an image, show cropper full replacing the body */}
                        {imageSrc ? (
                            <div className="flex-1 flex flex-col p-5 overflow-hidden">
                                <div className="relative flex-1 bg-black rounded-xl overflow-hidden min-h-[300px]">
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
                                <div className="mt-4 pt-4 flex gap-3">
                                    <button
                                        onClick={() => setImageSrc(null)}
                                        className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors"
                                    >
                                        Cancel Crop
                                    </button>
                                    <button
                                        onClick={confirmCrop}
                                        className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors"
                                    >
                                        Confirm Crop
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto">
                                {/* Tabs */}
                                <div className="flex border-b border-white/5">
                                    <button
                                        onClick={() => setActiveTab("upload")}
                                        className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === "upload" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}
                                    >
                                        Upload Image
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("defaults")}
                                        className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === "defaults" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}
                                    >
                                        Default Avatars
                                    </button>
                                </div>

                                <div className="p-6">
                                    {/* Current Preview */}
                                    <div className="flex flex-col items-center justify-center mb-8">
                                        <div className="relative group">
                                            <img
                                                src={previewAvatar || DEFAULT_AVATARS[6].url}
                                                alt="Avatar Preview"
                                                className="w-28 h-28 rounded-full object-cover border-4 border-slate-700 bg-slate-800 shadow-xl"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-slate-300 mt-4">Preview</p>
                                    </div>

                                    {activeTab === "upload" && (
                                        <div className="space-y-4">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-800 border border-slate-700 border-dashed text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all text-sm font-medium group"
                                            >
                                                <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                                                Click to upload image
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                            />
                                            <p className="text-center text-xs text-slate-500">Supports JPG, PNG (Max 5MB)</p>
                                        </div>
                                    )}

                                    {activeTab === "defaults" && (
                                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                            {DEFAULT_AVATARS.map((avatar) => (
                                                <button
                                                    key={avatar.id}
                                                    onClick={() => setPreviewAvatar(avatar.url)}
                                                    className={`relative aspect-square rounded-full transition-all overflow-hidden bg-slate-800 ${previewAvatar === avatar.url
                                                            ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-105'
                                                            : 'hover:scale-105 opacity-70 hover:opacity-100 hover:ring-2 hover:ring-slate-700'
                                                        }`}
                                                >
                                                    <img src={avatar.url} alt={avatar.id} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        {!imageSrc && (
                            <div className="flex items-center gap-3 p-5 border-t border-white/10 shrink-0 bg-slate-900">
                                <button
                                    onClick={handleRemoveAvatar}
                                    disabled={isSaving}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 transition-colors tooltip-trigger"
                                    title="Remove Avatar"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || previewAvatar === userAvatar}
                                    className="flex-[2] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : success ? <Check size={16} /> : "Save Avatar"}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
