export interface Channel {
  number: number;
  name: string;
  url: string;
}

export interface Radio {
  number: number;
  name: string;
  url: string;
}

export interface VersionInfo {
  version: string;
  apkUrl: string;
  releaseNotes: string;
}

export type MediaType = 'tv' | 'radio';
