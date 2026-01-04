export type AssetType = 'image';

export interface GeneratedAsset {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: string;
  type: AssetType;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16";

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  style: string;
}

export const STYLES = [
  "Photorealistic",
  "Cinematic",
  "Anime",
  "Cyberpunk",
  "Oil Painting",
  "3D Render",
  "Sketch",
  "Watercolor",
  "Pixel Art"
];