import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, DollarSign, Target, Zap } from 'lucide-react';
import HoverDialog from '@/components/HoverDialog';

interface ValueSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinId?: string;
}

const ValueSelectionModal: React.FC<ValueSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  coinId 
}) => {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  // Value options based on the screenshot (0.1, 0.2, 0.5, 1)
  const valueOptions = [
    { value: 0.001, label: '0.001 ETH', description: 'Conservative' },
    { value: 0.002, label: '0.002 ETH', description: 'Moderate' },
    { value: 0.005, label: '0.005 ETH', description: 'Aggressive' },
    { value: 0.01, label: '0.01 ETH', description: 'Maximum' }
  ];

  const handleValueSelect = (value: number) => {
    setSelectedValue(value);
    // Auto-navigate immediately after selection
    const url = coinId 
      ? `/trading?value=${value}&coin=${coinId}`
      : `/trading?value=${value}`;
    navigate(url);
    onClose();
  };

  const handleClose = () => {
    setSelectedValue(null);
    onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={handleClose}
          />
          
          {/* Compact Modal - Horizontal Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative bg-white rounded-2xl shadow-xl border border-gray-200"
            style={{ 
              boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Header - Minimal */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Choose Value
                </h3>
                <button
                  onClick={handleClose}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Horizontal Value Options */}
            <div className="p-6">
              <div className="flex gap-3">
                {valueOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * valueOptions.indexOf(option) }}
                    className="flex-1"
                  >
                    <HoverDialog
                      dialogContent={
                        <div className="space-y-1 p-2">
                          <div className="text-sm font-medium text-black">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                          <div className="text-xs text-gray-500">
                            ≈ ${(option.value * 2000).toFixed(0)} USD
                          </div>
                        </div>
                      }
                    >
                      <div 
                        className={`relative bg-white border rounded-xl p-4 cursor-pointer transition-all duration-200 text-center ${
                          selectedValue === option.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => handleValueSelect(option.value)}
                        style={{ 
                          boxShadow: selectedValue === option.value 
                            ? '0px 4px 12px rgba(59, 130, 246, 0.15)' 
                            : '0px 2px 8px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                        </div>
                        <h4 className="text-sm font-medium text-black mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {option.label}
                        </h4>
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {option.description}
                        </p>
                        {selectedValue === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Target className="w-2.5 h-2.5 text-white" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </HoverDialog>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ValueSelectionModal;
