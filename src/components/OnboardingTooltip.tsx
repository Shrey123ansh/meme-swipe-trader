import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    text: string;
    onClick: () => void;
  };
}

interface OnboardingTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  steps: OnboardingStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

const OnboardingTooltip = ({
  isOpen,
  onClose,
  steps,
  currentStep,
  onNext,
  onPrev,
  onComplete
}: OnboardingTooltipProps) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (isOpen && currentStepData) {
      const element = document.querySelector(`[data-tour="${currentStepData.target}"]`) as HTMLElement;
      if (element) {
        setTargetElement(element);
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        setPosition({
          top: rect.top + scrollTop + (currentStepData.position === 'bottom' ? rect.height + 10 : -10),
          left: rect.left + scrollLeft + rect.width / 2
        });
      }
    }
  }, [isOpen, currentStep, currentStepData]);

  if (!isOpen || !currentStepData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50"
        style={{ pointerEvents: 'none' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" style={{ pointerEvents: 'auto' }} />
        
        {/* Tooltip */}
        <div
          className="absolute bg-white rounded-2xl shadow-2xl border border-border p-6 max-w-sm"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateX(-50%)',
            pointerEvents: 'auto'
          }}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {currentStepData.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {currentStepData.description}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full flex-1 ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrev}
                    className="mini-app-button"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex space-x-2">
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={onNext}
                    size="sm"
                    className="mini-app-button-primary"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={onComplete}
                    size="sm"
                    className="mini-app-button-primary"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </div>

            {/* Custom action */}
            {currentStepData.action && (
              <Button
                onClick={currentStepData.action.onClick}
                variant="outline"
                className="w-full mini-app-button"
              >
                {currentStepData.action.text}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTooltip;
