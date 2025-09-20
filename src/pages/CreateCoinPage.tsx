import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const CreateCoinPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    description: '',
    price: '',
    image: null as File | null
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleCreateCoin = async () => {
    // Validate form
    if (!formData.symbol || !formData.name || !formData.description || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        className: "bg-destructive text-destructive-foreground"
      });
      return;
    }

    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "🚀 Coin Created!",
        description: `${formData.name} (${formData.symbol}) has been created successfully`,
        className: "bg-success text-success-foreground"
      });
      setIsCreating(false);
      navigate('/');
    }, 2000);
  };

  // Calculate description quality based on length
  const getDescriptionQuality = () => {
    const length = formData.description.length;
    if (length < 50) return { percentage: 0, color: 'text-red-500' };
    if (length < 100) return { percentage: 25, color: 'text-orange-500' };
    if (length < 200) return { percentage: 50, color: 'text-yellow-500' };
    if (length < 300) return { percentage: 75, color: 'text-blue-500' };
    return { percentage: 100, color: 'text-green-500' };
  };

  const quality = getDescriptionQuality();

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Main Card - Clean White Design */}
        <div className="bg-white rounded-[30px] shadow-lg p-8 space-y-7">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-[30px] font-normal text-[#0000ee] leading-[45px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Create New Coin
            </h1>
            <p className="text-[rgba(0,0,0,0.3)] text-[30px] leading-[36px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Launch your memecoin
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-[#f2f2f7] rounded-[8px] h-1 w-full">
            <div 
              className="bg-[#007aff] h-1 rounded-[4px] transition-all duration-300"
              style={{ width: '20%' }}
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Token Symbol */}
            <div className="space-y-2">
              <label className="text-[14px] text-[rgba(0,0,0,0.5)] leading-[21px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Token Symbol
              </label>
              <div className="relative">
                <Input
                  value={formData.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                  placeholder="DOGE"
                  className="bg-[#f2f2f7] border-0 rounded-[16px] h-12 pl-4 pr-12 text-[16px] placeholder:text-[#999999] focus:ring-0"
                  maxLength={6}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[rgba(0,0,0,0.3)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formData.symbol.length}/6
                </div>
              </div>
            </div>

            {/* Token Name */}
            <div className="space-y-2">
              <label className="text-[14px] text-[rgba(0,0,0,0.5)] leading-[21px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Token Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Dogecoin"
                className="bg-[#f2f2f7] border-0 rounded-[16px] h-12 pl-4 text-[16px] placeholder:text-[#999999] focus:ring-0"
              />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="text-[14px] text-[rgba(0,0,0,0.5)] leading-[21px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Description
              </label>
              <div className="space-y-3">
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your token..."
                  className="bg-[#f2f2f7] border-0 rounded-[16px] h-[120px] p-4 text-[16px] placeholder:text-[#999999] focus:ring-0 resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[rgba(0,0,0,0.3)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {formData.description.length} characters
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Quality:
                    </span>
                    <div className="bg-[#f2f2f7] h-1 w-10 rounded-[2px]">
                      <div 
                        className={`h-1 rounded-[2px] transition-all duration-300 ${
                          quality.percentage === 0 ? 'bg-red-500' :
                          quality.percentage <= 25 ? 'bg-orange-500' :
                          quality.percentage <= 50 ? 'bg-yellow-500' :
                          quality.percentage <= 75 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${quality.percentage}%` }}
                      />
                    </div>
                    <span className={`text-[12px] ${quality.color}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {quality.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Initial Price */}
            <div className="space-y-2">
              <label className="text-[14px] text-[rgba(0,0,0,0.5)] leading-[21px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Initial Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  $
                </span>
                <Input
                  type="number"
                  step="0.000001"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  className="bg-[#f2f2f7] border-0 rounded-[16px] h-12 pl-8 text-[16px] placeholder:text-[#999999] focus:ring-0"
                />
              </div>
            </div>

            {/* Token Image */}
            <div className="space-y-2">
              <label className="text-[14px] text-[rgba(0,0,0,0.5)] leading-[21px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Token Image
              </label>
              <div className="relative">
                <div className="bg-[#f2f2f7] border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-[16px] p-8 text-center hover:border-[rgba(0,0,0,0.2)] transition-colors">
                  {formData.image ? (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-lg overflow-hidden bg-white">
                        <img 
                          src={URL.createObjectURL(formData.image)} 
                          alt="Token preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[14px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {formData.image.name}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                        className="text-[12px] h-8 px-3"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-8 h-8 mx-auto">
                        <Upload className="w-8 h-8 text-[rgba(0,0,0,0.5)]" />
                      </div>
                      <p className="text-[14px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Drop image or click to browse
                      </p>
                      <p className="text-[12px] text-[rgba(0,0,0,0.3)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Create Button */}
            <div className="pt-4">
              <Button
                onClick={handleCreateCoin}
                disabled={isCreating}
                className="w-full bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.3)] rounded-[30px] h-12 text-[14px] font-normal transition-colors disabled:opacity-50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isCreating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[rgba(0,0,0,0.3)] border-t-transparent rounded-full animate-spin" />
                    <span>Creating Coin...</span>
                  </div>
                ) : (
                  'Create Coin'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => navigate('/')}
            className="w-12 h-12 bg-black rounded-full p-0 hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateCoinPage;
