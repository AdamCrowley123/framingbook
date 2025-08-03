
import type { PageSize } from './types';

export const FONT_OPTIONS = [
  { name: 'Bangers', value: "'Bangers', cursive" },
  { name: 'Comic Neue', value: "'Comic Neue', cursive" },
  { name: 'Inter', value: "'Inter', sans-serif" },
];

export const PAGE_SIZE_OPTIONS: PageSize[] = [
  { name: 'Manga Tankōbon', subtitle: 'B6', width: 1512, height: 2150, backgroundImage: '/tankobon.png' },
  { name: 'Manga Deluxe', subtitle: 'A5', width: 1748, height: 2480, backgroundImage: '/deluxe.png' },
  { name: 'US Comic Book', subtitle: 'Standard', width: 1988, height: 3075, backgroundImage: '/uscomic.png' },
  { name: 'Topolino Libretto', subtitle: 'Digest', width: 1476, height: 2185, backgroundImage: '/topolino.png' },
  { name: 'Franco-Belga', subtitle: 'Album', width: 2550, height: 3366, backgroundImage: '/francobelga.png' },
];