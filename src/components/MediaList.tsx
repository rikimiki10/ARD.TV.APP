import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel, Radio, MediaType } from "@/types";
import { Badge } from "@/components/ui/badge";

interface MediaListProps {
  items: Channel[] | Radio[];
  type: MediaType;
  onSelect: (item: Channel | Radio) => void;
}

export function MediaList({ items, type, onSelect }: MediaListProps) {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.number.toString().includes(search)
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar ${type === 'tv' ? 'canales' : 'radios'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredItems.map((item) => (
            <button
              key={item.number}
              onClick={() => onSelect(item)}
              disabled={!item.url}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Badge variant="outline" className="shrink-0">
                {item.number}
              </Badge>
              <span className="text-sm font-medium truncate">{item.name}</span>
              {!item.url && (
                <span className="ml-auto text-xs text-muted-foreground">Sin URL</span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
