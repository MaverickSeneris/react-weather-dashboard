import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

function FloatingRefreshButton({ onClick, isRefreshing, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isRefreshing}
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="fixed top-4 right-4 z-50 p-2 rounded-full shadow-lg"
      style={{ 
        backgroundColor: 'var(--bg-1)',
        color: 'var(--fg)',
        border: '2px solid var(--bg-2)',
        opacity: (isRefreshing || disabled) ? 0.5 : 1,
        cursor: (isRefreshing || disabled) ? 'not-allowed' : 'pointer'
      }}
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}
    >
      <motion.div
        animate={{ rotate: isRefreshing ? 360 : 0 }}
        transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
      >
        <FiRefreshCw size={18} />
      </motion.div>
    </motion.button>
  );
}

export default FloatingRefreshButton;

