

export interface UploadedImage {
  id: string;
  file: File;
  url:string;
  width: number;
  height: number;
}

export interface PanelData {
  id:string;
  image?: UploadedImage;
  fitting: 'contain' | 'cover';
  zoom: number;
  positionX: number; // Percentage (0-100)
  positionY: number; // Percentage (0-100)
  rotation: number;  // Degrees
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export type ComicLayout = LayoutItem[];

export interface TextProperties {
    content: string;
    fontSize: number;
    color: string;
    fontFamily: string;
    positionX: number; // Percentage (0-100)
    positionY: number; // Percentage (0-100)
}

export interface PageSettings {
    gutterSize: number;
    pageMargin: number;
}

export interface PanelStyle {
    panelBorderSize: number;
    panelBorderColor: string;
    panelBackgroundColor: string;
}

export interface PageSize {
  name: string;
  subtitle: string;
  width: number;
  height: number;
  backgroundImage?: string;
}