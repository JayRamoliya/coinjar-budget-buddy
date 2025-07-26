import React from 'react';
import { cn } from '@/lib/utils';

interface CoinJarProps {
  remainingAmount: number;
  totalBudget: number;
  className?: string;
}

const CoinJar: React.FC<CoinJarProps> = ({ remainingAmount, totalBudget, className }) => {
  // Calculate number of coins (₹100 = 1 coin)
  const coinCount = Math.floor(remainingAmount / 100);
  const maxCoins = Math.floor(totalBudget / 100);
  const fillPercentage = maxCoins > 0 ? (coinCount / maxCoins) * 100 : 0;
  
  // Create coins array for animation
  const coins = Array.from({ length: Math.min(coinCount, 20) }, (_, i) => ({
    id: i,
    size: Math.random() * 0.3 + 0.8, // Random size between 0.8 and 1.1
    delay: Math.random() * 2, // Random animation delay
  }));

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Jar Container */}
      <div className="relative w-48 h-64 mx-auto">
        {/* Jar Body */}
        <div className="absolute bottom-0 w-full h-48 bg-gradient-jar border-2 border-jar-rim rounded-b-3xl shadow-jar">
          {/* Jar Neck */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-jar border-2 border-jar-rim rounded-t-lg"></div>
          
          {/* Water Level Indicator */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-savings-green/20 rounded-b-3xl transition-all duration-1000 ease-out"
            style={{ height: `${fillPercentage}%` }}
          />
          
          {/* Coins */}
          <div className="absolute inset-2 overflow-hidden rounded-b-3xl">
            {coins.map((coin) => (
              <div
                key={coin.id}
                className="absolute bg-gradient-coin rounded-full shadow-coin animate-float border border-coin-shine/50"
                style={{
                  width: `${20 * coin.size}px`,
                  height: `${20 * coin.size}px`,
                  left: `${Math.random() * 70 + 10}%`,
                  bottom: `${Math.random() * (fillPercentage - 10) + 5}%`,
                  animationDelay: `${coin.delay}s`,
                }}
              />
            ))}
          </div>
          
          {/* Jar Shine Effect */}
          <div className="absolute inset-0 rounded-b-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
        </div>
        
        {/* Jar Lid */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-jar-rim border-2 border-jar-rim/60 rounded-full shadow-md"></div>
      </div>
      
      {/* Amount Display */}
      <div className="mt-6 text-center">
        <div className="text-3xl font-bold text-primary mb-1">
          ₹{remainingAmount.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground">
          {coinCount} coins remaining
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {fillPercentage.toFixed(1)}% of budget left
        </div>
      </div>
    </div>
  );
};

export default CoinJar;