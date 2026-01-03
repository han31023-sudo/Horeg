import React, { useEffect, useState } from 'react';
import { X, Star, Download, Smartphone } from 'lucide-react';
import { AD_CONFIG } from '../constants';

interface AdOverlayProps {
  type: 'INTERSTITIAL' | 'REWARD';
  onClose: () => void;
  onReward?: () => void;
}

const AdOverlay: React.FC<AdOverlayProps> = ({ type, onClose, onReward }) => {
  // Reward ads take longer (15s) than Interstitials (5s)
  const [countdown, setCountdown] = useState(type === 'REWARD' ? 15 : 5);
  const [canClose, setCanClose] = useState(false);
  const adUnitId = type === 'INTERSTITIAL' ? AD_CONFIG.INTERSTITIAL_ID : AD_CONFIG.REWARD_ID;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          if (type === 'REWARD' && onReward) onReward();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [type, onReward]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white text-black w-full max-w-[90%] md:max-w-sm rounded-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        {/* Ad Header */}
        <div className="bg-gray-100 px-4 py-2 flex justify-between items-center text-[10px] text-gray-500 font-mono border-b border-gray-200">
           <div className="flex items-center gap-1">
             <span className="bg-yellow-400 text-black px-1 rounded font-bold">Ad</span>
             <span>Google AdMob • {type}</span>
           </div>
           <span>00:{countdown.toString().padStart(2, '0')}</span>
        </div>

        {/* Debug Info (For verification) */}
        <div className="bg-gray-50 px-4 py-1 text-[9px] text-gray-400 font-mono break-all text-center">
          {adUnitId}
        </div>

        {/* Ad Content (Mock) */}
        <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-4 md:space-y-6">
           <div className="relative">
              <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full"></div>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg relative z-10 transform -rotate-3">
                <Smartphone className="text-white" size={40} />
              </div>
           </div>
           
           <div>
             <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">Super App 2025</h3>
             <p className="text-gray-600 text-sm mt-2 leading-relaxed">Boost your productivity with the ultimate tool. 5-star rated by millions.</p>
             <div className="flex justify-center gap-1 mt-3">
               {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
             </div>
           </div>

           <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-blue-200 shadow-lg active:scale-95 transform">
             <Download size={18} />
             <span>Install Now</span>
           </button>
        </div>

        {/* Footer / Close Logic */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center min-h-[60px]">
           {countdown > 0 ? (
             <div className="text-xs text-gray-400 font-medium">
               Reward granted in {countdown}s
             </div>
           ) : (
             <span className="text-xs text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
               <Star size={12} className="fill-green-600" />
               {type === 'REWARD' ? 'Reward Earned' : 'Completed'}
             </span>
           )}

           {canClose && (
             <button 
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition hover:rotate-90 duration-300"
                aria-label="Close Ad"
             >
                <X size={20} />
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdOverlay;
