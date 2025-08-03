
import type { ComicLayout } from './types';

export const PAGE_GRID_COLS = 12;
export const PAGE_GRID_ROWS = 17;

const addMinSize = (layout: ComicLayout): ComicLayout => layout.map(l => ({ ...l, minW: 2, minH: 2, static: true }));

const STATIC_TEMPLATES: { [key: number]: ComicLayout[] } = {
  2: [
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 8 },
      { i: '2', x: 0, y: 8, w: 12, h: 9 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 6, h: 17 },
      { i: '2', x: 6, y: 0, w: 6, h: 17 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 13 },
      { i: '2', x: 0, y: 13, w: 12, h: 4 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 8, h: 17 },
      { i: '2', x: 8, y: 0, w: 4, h: 17 }
    ])
  ],
  3: [
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 6 },
      { i: '2', x: 0, y: 6, w: 12, h: 5 },
      { i: '3', x: 0, y: 11, w: 12, h: 6 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 4, h: 17 },
      { i: '2', x: 4, y: 0, w: 4, h: 17 },
      { i: '3', x: 8, y: 0, w: 4, h: 17 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 9 },
      { i: '2', x: 0, y: 9, w: 6, h: 8 },
      { i: '3', x: 6, y: 9, w: 6, h: 8 }
    ]),
    addMinSize([
        { i: '1', x: 0, y: 0, w: 7, h: 17 },
        { i: '2', x: 7, y: 0, w: 5, h: 8 },
        { i: '3', x: 7, y: 8, w: 5, h: 9 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 8, h: 10 },
      { i: '2', x: 8, y: 0, w: 4, h: 17 },
      { i: '3', x: 0, y: 10, w: 8, h: 7 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 4, h: 17 },
      { i: '2', x: 4, y: 0, w: 8, h: 8 },
      { i: '3', x: 4, y: 8, w: 8, h: 9 }
    ])
  ],
  4: [
    addMinSize([
      { i: '1', x: 0, y: 0, w: 6, h: 8 },
      { i: '2', x: 6, y: 0, w: 6, h: 8 },
      { i: '3', x: 0, y: 8, w: 6, h: 9 },
      { i: '4', x: 6, y: 8, w: 6, h: 9 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 4 },
      { i: '2', x: 0, y: 4, w: 12, h: 4 },
      { i: '3', x: 0, y: 8, w: 12, h: 5 },
      { i: '4', x: 0, y: 13, w: 12, h: 4 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 9 },
      { i: '2', x: 0, y: 9, w: 4, h: 8 },
      { i: '3', x: 4, y: 9, w: 4, h: 8 },
      { i: '4', x: 8, y: 9, w: 4, h: 8 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 5, h: 17 },
      { i: '2', x: 5, y: 0, w: 7, h: 6 },
      { i: '3', x: 5, y: 6, w: 7, h: 5 },
      { i: '4', x: 5, y: 11, w: 7, h: 6 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 5 },
      { i: '2', x: 0, y: 5, w: 12, h: 6 },
      { i: '3', x: 0, y: 11, w: 6, h: 6 },
      { i: '4', x: 6, y: 11, w: 6, h: 6 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 6, h: 6 },
      { i: '2', x: 6, y: 0, w: 6, h: 6 },
      { i: '3', x: 0, y: 6, w: 12, h: 6 },
      { i: '4', x: 0, y: 12, w: 12, h: 5 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 5 },
      { i: '2', x: 0, y: 5, w: 6, h: 7 },
      { i: '3', x: 6, y: 5, w: 6, h: 7 },
      { i: '4', x: 0, y: 12, w: 12, h: 5 }
    ])
  ],
  5: [
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 7 },
      { i: '2', x: 0, y: 7, w: 6, h: 5 },
      { i: '3', x: 6, y: 7, w: 6, h: 5 },
      { i: '4', x: 0, y: 12, w: 6, h: 5 },
      { i: '5', x: 6, y: 12, w: 6, h: 5 }
    ]),
     addMinSize([
        { i: '1', x: 0, y: 0, w: 4, h: 8 },
        { i: '2', x: 0, y: 8, w: 4, h: 9 },
        { i: '3', x: 4, y: 0, w: 4, h: 17 },
        { i: '4', x: 8, y: 0, w: 4, h: 8 },
        { i: '5', x: 8, y: 8, w: 4, h: 9 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 6, h: 5 },
      { i: '2', x: 6, y: 0, w: 6, h: 5 },
      { i: '3', x: 0, y: 5, w: 12, h: 7 },
      { i: '4', x: 0, y: 12, w: 6, h: 5 },
      { i: '5', x: 6, y: 12, w: 6, h: 5 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 5, h: 7 },
      { i: '2', x: 7, y: 0, w: 5, h: 7 },
      { i: '3', x: 0, y: 10, w: 5, h: 7 },
      { i: '4', x: 7, y: 10, w: 5, h: 7 },
      { i: '5', x: 0, y: 7, w: 12, h: 3 }
    ])
  ],
  6: [
    addMinSize([
      { i: '1', x: 0, y: 0, w: 6, h: 6 },
      { i: '2', x: 6, y: 0, w: 6, h: 6 },
      { i: '3', x: 0, y: 6, w: 6, h: 5 },
      { i: '4', x: 6, y: 6, w: 6, h: 5 },
      { i: '5', x: 0, y: 11, w: 6, h: 6 },
      { i: '6', x: 6, y: 11, w: 6, h: 6 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 4, h: 8 },
      { i: '2', x: 4, y: 0, w: 4, h: 8 },
      { i: '3', x: 8, y: 0, w: 4, h: 8 },
      { i: '4', x: 0, y: 8, w: 4, h: 9 },
      { i: '5', x: 4, y: 8, w: 4, h: 9 },
      { i: '6', x: 8, y: 8, w: 4, h: 9 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 8, h: 8 },
      { i: '2', x: 8, y: 0, w: 4, h: 4 },
      { i: '3', x: 8, y: 4, w: 4, h: 4 },
      { i: '4', x: 0, y: 8, w: 4, h: 9 },
      { i: '5', x: 4, y: 8, w: 4, h: 9 },
      { i: '6', x: 8, y: 8, w: 4, h: 9 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 5 },
      { i: '2', x: 0, y: 5, w: 6, h: 6 },
      { i: '3', x: 6, y: 5, w: 6, h: 6 },
      { i: '4', x: 0, y: 11, w: 4, h: 6 },
      { i: '5', x: 4, y: 11, w: 4, h: 6 },
      { i: '6', x: 8, y: 11, w: 4, h: 6 }
    ])
  ],
  8: [
    addMinSize([
      { i: '1', x: 0, y: 0, w: 6, h: 4 }, { i: '2', x: 6, y: 0, w: 6, h: 4 },
      { i: '3', x: 0, y: 4, w: 6, h: 4 }, { i: '4', x: 6, y: 4, w: 6, h: 4 },
      { i: '5', x: 0, y: 8, w: 6, h: 4 }, { i: '6', x: 6, y: 8, w: 6, h: 4 },
      { i: '7', x: 0, y: 12, w: 6, h: 5 }, { i: '8', x: 6, y: 12, w: 6, h: 5 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 9, h: 12 },
      { i: '2', x: 9, y: 0, w: 3, h: 4 },
      { i: '3', x: 9, y: 4, w: 3, h: 4 },
      { i: '4', x: 9, y: 8, w: 3, h: 4 },
      { i: '5', x: 0, y: 12, w: 3, h: 5 },
      { i: '6', x: 3, y: 12, w: 3, h: 5 },
      { i: '7', x: 6, y: 12, w: 3, h: 5 },
      { i: '8', x: 9, y: 12, w: 3, h: 5 }
    ]),
    addMinSize([
      { i: '1', x: 0, y: 0, w: 12, h: 4 },
      { i: '2', x: 0, y: 4, w: 4, h: 6 },
      { i: '3', x: 4, y: 4, w: 8, h: 6 },
      { i: '4', x: 0, y: 10, w: 4, h: 7 },
      { i: '5', x: 4, y: 10, w: 4, h: 3 },
      { i: '6', x: 8, y: 10, w: 4, h: 3 },
      { i: '7', x: 4, y: 13, w: 4, h: 4 },
      { i: '8', x: 8, y: 13, w: 4, h: 4 }
    ])
  ]
};

export const TEMPLATES = STATIC_TEMPLATES;


interface Divider {
  id: string;
  label: string;
  orientation: 'vertical' | 'horizontal';
  min: number;
  max: number;
  initialValue: number;
  minId?: string; // another divider id that this one's min depends on
  maxId?: string; // another divider id that this one's max depends on
}

interface LayoutOptionControl {
  id: string;
  label: string;
  type: 'radio';
  choices: { label: string; value: string }[];
  defaultValue: string;
}

interface LayoutConfig {
  dividers: Divider[];
  options?: LayoutOptionControl[];
  generateLayout: (
    values: { [key: string]: number },
    options?: { [key: string]: string }
  ) => ComicLayout;
}

export const LAYOUT_CONFIGS: { [key: number]: LayoutConfig } = {
  2: {
    dividers: [
      { id: 'h1', label: 'Horizontal Split', orientation: 'horizontal', min: 2, max: PAGE_GRID_ROWS - 2, initialValue: 8 },
    ],
    generateLayout: (v, _options) => [
      { i: '1', x: 0, y: 0, w: PAGE_GRID_COLS, h: v.h1 },
      { i: '2', x: 0, y: v.h1, w: PAGE_GRID_COLS, h: PAGE_GRID_ROWS - v.h1 },
    ],
  },
  3: {
    dividers: [
      { id: 'v1', label: 'Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 7 },
      { id: 'h1', label: 'Horizontal Split', orientation: 'horizontal', min: 2, max: PAGE_GRID_ROWS - 2, initialValue: 8 },
    ],
    options: [
        {
          id: 'largePanelPosition',
          label: 'Large Panel Position',
          type: 'radio',
          choices: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
            { label: 'Top', value: 'top' },
            { label: 'Bottom', value: 'bottom' },
          ],
          defaultValue: 'left',
        }
    ],
    generateLayout: (v, options) => {
        const position = options?.largePanelPosition || 'left';
        switch (position) {
            case 'top':
                return [
                    { i: '1', x: 0, y: 0, w: PAGE_GRID_COLS, h: v.h1 },
                    { i: '2', x: 0, y: v.h1, w: v.v1, h: PAGE_GRID_ROWS - v.h1 },
                    { i: '3', x: v.v1, y: v.h1, w: PAGE_GRID_COLS - v.v1, h: PAGE_GRID_ROWS - v.h1 },
                ];
            case 'bottom':
                return [
                    { i: '1', x: 0, y: 0, w: v.v1, h: v.h1 },
                    { i: '2', x: v.v1, y: 0, w: PAGE_GRID_COLS - v.v1, h: v.h1 },
                    { i: '3', x: 0, y: v.h1, w: PAGE_GRID_COLS, h: PAGE_GRID_ROWS - v.h1 },
                ];
            case 'right':
                 return [
                    { i: '1', x: 0, y: 0, w: v.v1, h: v.h1 },
                    { i: '2', x: 0, y: v.h1, w: v.v1, h: PAGE_GRID_ROWS - v.h1 },
                    { i: '3', x: v.v1, y: 0, w: PAGE_GRID_COLS - v.v1, h: PAGE_GRID_ROWS },
                ];
            case 'left':
            default:
                return [
                    { i: '1', x: 0, y: 0, w: v.v1, h: PAGE_GRID_ROWS },
                    { i: '2', x: v.v1, y: 0, w: PAGE_GRID_COLS - v.v1, h: v.h1 },
                    { i: '3', x: v.v1, y: v.h1, w: PAGE_GRID_COLS - v.v1, h: PAGE_GRID_ROWS - v.h1 },
                ];
        }
    },
  },
  4: {
    dividers: [
      { id: 'h1', label: 'Horizontal Split', orientation: 'horizontal', min: 2, max: PAGE_GRID_ROWS - 2, initialValue: 8 },
      { id: 'v1', label: 'Top Row Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
      { id: 'v2', label: 'Bottom Row Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
    ],
    generateLayout: (v, _options) => [
      { i: '1', x: 0, y: 0, w: v.v1, h: v.h1 },
      { i: '2', x: v.v1, y: 0, w: PAGE_GRID_COLS - v.v1, h: v.h1 },
      { i: '3', x: 0, y: v.h1, w: v.v2, h: PAGE_GRID_ROWS - v.h1 },
      { i: '4', x: v.v2, y: v.h1, w: PAGE_GRID_COLS - v.v2, h: PAGE_GRID_ROWS - v.h1 },
    ],
  },
  5: {
    dividers: [
      { id: 'h1', label: 'Top Horizontal Split', orientation: 'horizontal', min: 2, max: PAGE_GRID_ROWS - 4, initialValue: 5, maxId: 'h2' },
      { id: 'h2', label: 'Bottom Horizontal Split', orientation: 'horizontal', min: 4, max: PAGE_GRID_ROWS - 2, initialValue: 12, minId: 'h1' },
      { id: 'v1', label: 'Top Row Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
      { id: 'v2', label: 'Bottom Row Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
    ],
    options: [
        {
          id: 'structure',
          label: 'Layout Structure',
          type: 'radio',
          choices: [
            { label: 'Large Panel Top (1-2-2)', value: '1-2-2' },
            { label: 'Large Panel Middle (2-1-2)', value: '2-1-2' },
            { label: 'Large Panel Bottom (2-2-1)', value: '2-2-1' },
          ],
          defaultValue: '2-1-2',
        }
    ],
    generateLayout: (v, options) => {
        const structure = options?.structure || '2-1-2';
        switch (structure) {
            case '1-2-2':
                return [
                    { i: '1', x: 0, y: 0, w: PAGE_GRID_COLS, h: v.h1 },
                    { i: '2', x: 0, y: v.h1, w: v.v1, h: v.h2 - v.h1 },
                    { i: '3', x: v.v1, y: v.h1, w: PAGE_GRID_COLS - v.v1, h: v.h2 - v.h1 },
                    { i: '4', x: 0, y: v.h2, w: v.v2, h: PAGE_GRID_ROWS - v.h2 },
                    { i: '5', x: v.v2, y: v.h2, w: PAGE_GRID_COLS - v.v2, h: PAGE_GRID_ROWS - v.h2 },
                ];
            case '2-2-1':
                return [
                    { i: '1', x: 0, y: 0, w: v.v1, h: v.h1 },
                    { i: '2', x: v.v1, y: 0, w: PAGE_GRID_COLS - v.v1, h: v.h1 },
                    { i: '3', x: 0, y: v.h1, w: v.v2, h: v.h2 - v.h1 },
                    { i: '4', x: v.v2, y: v.h1, w: PAGE_GRID_COLS - v.v2, h: v.h2 - v.h1 },
                    { i: '5', x: 0, y: v.h2, w: PAGE_GRID_COLS, h: PAGE_GRID_ROWS - v.h2 },
                ];
            case '2-1-2':
            default:
                return [
                    { i: '1', x: 0, y: 0, w: v.v1, h: v.h1 },
                    { i: '2', x: v.v1, y: 0, w: PAGE_GRID_COLS - v.v1, h: v.h1 },
                    { i: '3', x: 0, y: v.h1, w: PAGE_GRID_COLS, h: v.h2 - v.h1 },
                    { i: '4', x: 0, y: v.h2, w: v.v2, h: PAGE_GRID_ROWS - v.h2 },
                    { i: '5', x: v.v2, y: v.h2, w: PAGE_GRID_COLS - v.v2, h: PAGE_GRID_ROWS - v.h2 },
                ];
        }
    },
  },
  6: {
    dividers: [
      { id: 'h1', label: 'Top Horizontal Split', orientation: 'horizontal', min: 2, max: PAGE_GRID_ROWS - 4, initialValue: 6, maxId: 'h2' },
      { id: 'h2', label: 'Bottom Horizontal Split', orientation: 'horizontal', min: 4, max: PAGE_GRID_ROWS - 2, initialValue: 11, minId: 'h1' },
      { id: 'v1', label: 'Top Row Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
      { id: 'v2', label: 'Middle Row Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
      { id: 'v3', label: 'Bottom Row Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
    ],
    generateLayout: (v, _options) => [
      { i: '1', x: 0, y: 0, w: v.v1, h: v.h1 },
      { i: '2', x: v.v1, y: 0, w: PAGE_GRID_COLS - v.v1, h: v.h1 },
      { i: '3', x: 0, y: v.h1, w: v.v2, h: v.h2 - v.h1 },
      { i: '4', x: v.v2, y: v.h1, w: PAGE_GRID_COLS - v.v2, h: v.h2 - v.h1 },
      { i: '5', x: 0, y: v.h2, w: v.v3, h: PAGE_GRID_ROWS - v.h2 },
      { i: '6', x: v.v3, y: v.h2, w: PAGE_GRID_COLS - v.v3, h: PAGE_GRID_ROWS - v.h2 },
    ],
  },
  8: {
    dividers: [
      { id: 'h1', label: 'Horizontal Split 1', orientation: 'horizontal', min: 2, max: PAGE_GRID_ROWS - 6, initialValue: 4, maxId: 'h2' },
      { id: 'h2', label: 'Horizontal Split 2', orientation: 'horizontal', min: 4, max: PAGE_GRID_ROWS - 4, initialValue: 8, minId: 'h1', maxId: 'h3' },
      { id: 'h3', label: 'Horizontal Split 3', orientation: 'horizontal', min: 6, max: PAGE_GRID_ROWS - 2, initialValue: 12, minId: 'h2' },
      { id: 'v1', label: 'Row 1 Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
      { id: 'v2', label: 'Row 2 Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
      { id: 'v3', label: 'Row 3 Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
      { id: 'v4', label: 'Row 4 Vertical Split', orientation: 'vertical', min: 2, max: PAGE_GRID_COLS - 2, initialValue: 6 },
    ],
    generateLayout: (v, _options) => [
        { i: '1', x: 0, y: 0, w: v.v1, h: v.h1 },
        { i: '2', x: v.v1, y: 0, w: PAGE_GRID_COLS - v.v1, h: v.h1 },
        { i: '3', x: 0, y: v.h1, w: v.v2, h: v.h2 - v.h1 },
        { i: '4', x: v.v2, y: v.h1, w: PAGE_GRID_COLS - v.v2, h: v.h2 - v.h1 },
        { i: '5', x: 0, y: v.h2, w: v.v3, h: v.h3 - v.h2 },
        { i: '6', x: v.v3, y: v.h2, w: PAGE_GRID_COLS - v.v3, h: v.h3 - v.h2 },
        { i: '7', x: 0, y: v.h3, w: v.v4, h: PAGE_GRID_ROWS - v.h3 },
        { i: '8', x: v.v4, y: v.h3, w: PAGE_GRID_COLS - v.v4, h: PAGE_GRID_ROWS - v.h3 },
    ],
  },
};
