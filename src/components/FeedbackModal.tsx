import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X, Star, Send, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting feedback",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Thank you! 🎉",
        description: "Your feedback has been submitted successfully",
        className: "bg-success text-success-foreground border-success"
      });
      
      // Reset form
      setRating(0);
      setFeedback('');
      setEmail('');
      onClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Share Your Feedback
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                How would you rate your experience?
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      star <= rating
                        ? 'bg-yellow-100 text-yellow-500'
                        : 'bg-muted text-muted-foreground hover:bg-yellow-50'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-3">
              <label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Tell us more (optional)
              </label>
              <Textarea
                placeholder="What did you like? What could be improved?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px] mobile-input"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {feedback.length}/500
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Email (optional)
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mobile-input"
              />
              <p className="text-xs text-muted-foreground">
                We'll only use this to follow up on your feedback
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 mini-app-button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 mini-app-button-primary"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
