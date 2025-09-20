import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HoverDialogProps {
  children: React.ReactNode;
  dialogContent: React.ReactNode;
  className?: string;
}

const HoverDialog: React.FC<HoverDialogProps> = ({ 
  children, 
  dialogContent, 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showDialog = () => setIsVisible(true);
  const hideDialog = () => setIsVisible(false);

  return (
    <div
      onMouseEnter={showDialog}
      onMouseLeave={hideDialog}
      className={`relative inline-block ${className}`}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
          >
            <div className="bg-card border border-border rounded-xl shadow-lg p-4 min-w-[200px]">
              {dialogContent}
            </div>
            {/* Arrow pointing up */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-card border-l border-t border-border rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoverDialog;
