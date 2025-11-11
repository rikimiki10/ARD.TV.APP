import { useQuery } from "@tanstack/react-query";
import { Channel, Radio, VersionInfo } from "@/types";

const BASE_URL = window.location.hostname === "localhost" 
  ? "" 
  : "https://mi-github.io/ARDTV";

export function useChannels() {
  return useQuery<Channel[]>({
    queryKey: ["channels"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/channels.json`);
      if (!response.ok) throw new Error("Failed to fetch channels");
      return response.json();
    },
  });
}

export function useRadios() {
  return useQuery<Radio[]>({
    queryKey: ["radios"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/radios.json`);
      if (!response.ok) throw new Error("Failed to fetch radios");
      return response.json();
    },
  });
}

export function useVersion() {
  return useQuery<VersionInfo>({
    queryKey: ["version"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/version.json`);
      if (!response.ok) throw new Error("Failed to fetch version");
      return response.json();
    },
  });
}
