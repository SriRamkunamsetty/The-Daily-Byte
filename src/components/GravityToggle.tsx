import { motion } from "framer-motion";
import { Zap, ZapOff } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { requestShakePermission } from "@/hooks/useShake";

export default function GravityToggle() {
    const { antigravity, toggleAntigravity } = useApp();

    const handleToggle = async () => {
        await requestShakePermission();
        toggleAntigravity();
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm w-full transition-colors ${antigravity
                ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 font-bold"
                : "text-foreground hover:bg-white/20 dark:hover:bg-white/10"
                }`}
        >
            {antigravity ? (
                <Zap size={16} className="text-amber-500 fill-amber-500" />
            ) : (
                <ZapOff size={16} className="text-muted-foreground" />
            )}
            <span>Antigravity Mode: {antigravity ? "ON" : "OFF"}</span>
        </motion.button>
    );
}
