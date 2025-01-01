interface VideoAreaProps {
  currentTranscription: string;
}

export const VideoArea = ({ currentTranscription }: VideoAreaProps) => {
  return (
    <div className="flex-1 p-4 relative">
      <div className="bg-[#222222] h-full rounded-lg flex items-center justify-center border border-[#333333]">
        <p className="text-gray-400">Video preview will appear here</p>
      </div>
      {/* Closed captions */}
      {currentTranscription && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/75 px-4 py-2 rounded-lg max-w-[80%] text-center">
          {currentTranscription}
        </div>
      )}
    </div>
  );
};