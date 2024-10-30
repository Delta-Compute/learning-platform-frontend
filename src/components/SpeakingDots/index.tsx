

interface SpeakingDotsProps {
  isConnected: boolean;
}

export const SpeakingDots = ({ isConnected }: SpeakingDotsProps) => {
  return (
    <div className="flex space-x-4 mt-8 justify-center items-center">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`w-12 h-12 bg-gray-800 rounded-full ${isConnected ? 'animate-bounce' : ''
            }`}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '0.8s',
          }}
        ></div>
      ))}
    </div>
  );
};