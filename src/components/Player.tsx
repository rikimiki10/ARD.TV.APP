import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Channel, Radio, MediaType } from "@/types";
import logo from "@/assets/logo.png";

interface PlayerProps {
  item: Channel | Radio;
  type: MediaType;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function Player({ item, type, onClose, onNext, onPrevious }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showNumber, setShowNumber] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const numberTimeoutRef = useRef<NodeJS.Timeout>();

  const isVideo = type === 'tv';
  const mediaRef = isVideo ? videoRef : audioRef;

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    setShowNumber(true);
    if (numberTimeoutRef.current) {
      clearTimeout(numberTimeoutRef.current);
    }
    numberTimeoutRef.current = setTimeout(() => {
      setShowNumber(false);
    }, 3000);

    return () => {
      if (numberTimeoutRef.current) {
        clearTimeout(numberTimeoutRef.current);
      }
    };
  }, [item.number]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const togglePlayPause = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((prev) => Math.min(100, prev + 10));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((prev) => Math.max(0, prev - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious?.();
          break;
        case 'Escape':
          onClose();
          break;
        case 'm':
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, onNext, onPrevious, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black z-40"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={item.url}
          autoPlay
          className="w-full h-full object-contain"
          onError={() => console.error("Error loading video")}
        />
      ) : (
        <>
          <div className="w-full h-full flex items-center justify-center">
            <img src={logo} alt="ARD TV" className="max-w-md opacity-50" />
          </div>
          <audio
            ref={audioRef}
            src={item.url}
            autoPlay
            onError={() => console.error("Error loading audio")}
          />
        </>
      )}

      {showNumber && (
        <div className="absolute top-8 left-8 bg-black/80 px-6 py-3 rounded-lg">
          <span className="text-4xl font-bold text-white">{item.number}</span>
        </div>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src={logo} alt="ARD TV" className="h-12" />
              <div>
                <h2 className="text-white font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-300 text-sm">Canal {item.number}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              disabled={!onPrevious}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              disabled={!onNext}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <div className="flex items-center gap-3 ml-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
