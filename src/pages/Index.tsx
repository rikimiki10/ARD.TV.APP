import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaList } from "@/components/MediaList";
import { Player } from "@/components/Player";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UpdateDialog } from "@/components/UpdateDialog";
import { useChannels, useRadios, useVersion } from "@/hooks/useMedia";
import { Channel, Radio, MediaType } from "@/types";
import logo from "@/assets/logo.png";

const APP_VERSION = "1.0.0";

const Index = () => {
  const { data: channels = [] } = useChannels();
  const { data: radios = [] } = useRadios();
  const { data: versionInfo } = useVersion();
  const [selectedItem, setSelectedItem] = useState<Channel | Radio | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("tv");
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  useEffect(() => {
    if (versionInfo && versionInfo.version !== APP_VERSION) {
      setShowUpdateDialog(true);
    }
  }, [versionInfo]);

  const handleNext = () => {
    if (!selectedItem) return;
    const items = mediaType === "tv" ? channels : radios;
    const currentIndex = items.findIndex((item) => item.number === selectedItem.number);
    if (currentIndex < items.length - 1) {
      const nextItem = items[currentIndex + 1];
      if (nextItem.url) {
        setSelectedItem(nextItem);
      }
    }
  };

  const handlePrevious = () => {
    if (!selectedItem) return;
    const items = mediaType === "tv" ? channels : radios;
    const currentIndex = items.findIndex((item) => item.number === selectedItem.number);
    if (currentIndex > 0) {
      const prevItem = items[currentIndex - 1];
      if (prevItem.url) {
        setSelectedItem(prevItem);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <ThemeToggle />
        
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="flex items-center justify-center gap-4 mb-8">
            <img src={logo} alt="ARD TV" className="h-16" />
            <h1 className="text-4xl font-bold">ARD TV</h1>
          </div>

          <Tabs defaultValue="tv" className="w-full" onValueChange={(value) => setMediaType(value as MediaType)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="tv">TV</TabsTrigger>
              <TabsTrigger value="radio">Radio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tv" className="h-[calc(100vh-240px)]">
              <MediaList
                items={channels}
                type="tv"
                onSelect={(item) => {
                  setSelectedItem(item);
                  setMediaType("tv");
                }}
              />
            </TabsContent>
            
            <TabsContent value="radio" className="h-[calc(100vh-240px)]">
              <MediaList
                items={radios}
                type="radio"
                onSelect={(item) => {
                  setSelectedItem(item);
                  setMediaType("radio");
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedItem && (
        <Player
          item={selectedItem}
          type={mediaType}
          onClose={() => setSelectedItem(null)}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {versionInfo && (
        <UpdateDialog
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          version={versionInfo.version}
          apkUrl={versionInfo.apkUrl}
          releaseNotes={versionInfo.releaseNotes}
        />
      )}
    </>
  );
};

export default Index;
