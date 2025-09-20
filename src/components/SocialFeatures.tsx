import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, MessageCircle, Bookmark, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SocialFeaturesProps {
  memecoinId: string;
  initialLikes?: number;
  initialComments?: number;
  initialShares?: number;
  isBookmarked?: boolean;
}

export default function SocialFeatures({ 
  memecoinId, 
  initialLikes = 0, 
  initialComments = 0, 
  initialShares = 0,
  isBookmarked = false 
}: SocialFeaturesProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [shares, setShares] = useState(initialShares);
  const [isLiked, setIsLiked] = useState(false);
  const [isBooked, setIsBooked] = useState(isBookmarked);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBooked(!isBooked);
  };

  const handleShare = () => {
    setShares(prev => prev + 1);
    // In a real app, this would trigger native sharing
    if (navigator.share) {
      navigator.share({
        title: 'Check out this memecoin!',
        text: 'Look at this trending memecoin on MemeTrader',
        url: window.location.href
      });
    }
  };

  return (
    <Card className="mini-app-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Community</h3>
          <Badge variant="secondary" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>

        {/* Social Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{likes}</div>
            <div className="text-xs text-muted-foreground">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{comments}</div>
            <div className="text-xs text-muted-foreground">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{shares}</div>
            <div className="text-xs text-muted-foreground">Shares</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`social-button ${isLiked ? 'bg-destructive/10' : ''}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-destructive fill-current' : 'text-muted-foreground'}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="social-button"
          >
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="social-button"
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          <motion.button
            onClick={handleBookmark}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`social-button ${isBooked ? 'bg-warning/10' : ''}`}
          >
            <Bookmark className={`w-4 h-4 ${isBooked ? 'text-warning fill-current' : 'text-muted-foreground'}`} />
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 mini-app-button">
              <TrendingUp className="w-3 h-3 mr-1" />
              Follow Trend
            </Button>
            <Button size="sm" variant="outline" className="flex-1 mini-app-button">
              <Users className="w-3 h-3 mr-1" />
              Join Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
