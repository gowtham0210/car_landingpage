/**
 * Central content + placeholder configuration.
 * Replace the empty strings in SOCIAL with real URLs when the brand has them.
 */
export const NAV = [
  { id: 'machine', label: 'The Machine' },
  { id: 'performance', label: 'Performance' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'collection', label: 'Collection' },
] as const;

export const SOCIAL = {
  instagram: '', // e.g. https://instagram.com/<handle>
  youtube: '', // e.g. https://youtube.com/@<channel>
  contact: '', // e.g. mailto:hello@yourdomain.com
};

export type ModelId = 'x1' | 'gt' | 'er';

export interface ModelData {
  id: ModelId;
  name: string;
  role: string;
  blurb: string;
  detail: string;
  specs: { label: string; value: string }[];
  more: { label: string; value: string }[];
  image: { name: string; widths: number[]; ratio: number };
  /** object-position used to give each model its own crop */
  pos: string;
  filter: string;
  accent: string;
}

export const MODELS: ModelData[] = [
  {
    id: 'x1',
    name: 'APEX X1',
    role: 'The Performance Coupe',
    blurb: 'A rear-driven coupe drawn around one idea: the shortest path between driver and road.',
    detail:
      'The X1 is the reference point for the range. A low, wide stance, a single blade of light across the tail and a drivetrain tuned for response rather than numbers.',
    specs: [
      { label: 'Power', value: '620 HP' },
      { label: '0–100 km/h', value: '3.2 s' },
      { label: 'Top speed', value: '320 km/h' },
    ],
    more: [
      { label: 'Transmission', value: '8-speed dual-clutch' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Layout', value: 'Two-seat coupe' },
      { label: 'Status', value: 'Concept specification' },
    ],
    image: { name: 'rear', widths: [900, 1800], ratio: 1800 / 1005 },
    pos: '62% 55%',
    filter: 'none',
    accent: '#d2581c',
  },
  {
    id: 'gt',
    name: 'APEX GT',
    role: 'The Grand Tourer',
    blurb: 'Long-distance composure with a cabin trimmed like an instrument. Quiet at speed, alert when asked.',
    detail:
      'The GT trades a little edge for a lot of range. A softer-trimmed cabin, adaptive damping and a gearbox calibrated for relaxed, continent-crossing pace.',
    specs: [
      { label: 'Power', value: '540 HP' },
      { label: '0–100 km/h', value: '3.9 s' },
      { label: 'Top speed', value: '300 km/h' },
    ],
    more: [
      { label: 'Transmission', value: '8-speed dual-clutch' },
      { label: 'Drivetrain', value: 'Rear-wheel drive' },
      { label: 'Layout', value: '2+2 grand tourer' },
      { label: 'Status', value: 'Concept specification' },
    ],
    image: { name: 'interior', widths: [1200, 2400], ratio: 3840 / 2560 },
    pos: '48% 50%',
    filter: 'sepia(0.18) saturate(1.05)',
    accent: '#c07a4a',
  },
  {
    id: 'er',
    name: 'APEX E-R',
    role: 'The Electric Performance Concept',
    blurb: 'Instant torque, near-silent power and a chassis that treats the battery as structure.',
    detail:
      'The E-R explores what performance feels like without combustion: a low centre of gravity, torque vectoring on every axle and braking that feeds energy back.',
    specs: [
      { label: 'Peak output', value: '745 kW' },
      { label: '0–100 km/h', value: '2.1 s' },
      { label: 'Top speed', value: '280 km/h' },
    ],
    more: [
      { label: 'Transmission', value: 'Single-speed, per-axle' },
      { label: 'Drivetrain', value: 'Dual-motor all-wheel drive' },
      { label: 'Range target', value: '450 km (concept target)' },
      { label: 'Status', value: 'Concept specification' },
    ],
    image: { name: 'wheel', widths: [1000, 2000], ratio: 2000 / 1333 },
    pos: '50% 55%',
    filter: 'grayscale(0.55) contrast(1.08)',
    accent: '#ece8e0',
  },
];

export type ViewId = 'exterior' | 'interior' | 'front' | 'side' | 'rear';
export const VIEWS: { id: ViewId; label: string; src: string; alt: string; srcSet?: string }[] = [
  { id: 'exterior', label: 'Exterior', src: '/media/view-exterior.webp', alt: 'APEX X1 concept in a dark studio, front three-quarter view' },
  { id: 'interior', label: 'Interior', src: '/media/interior-2400.webp', alt: 'Cockpit with carbon-fibre steering wheel and orange-trimmed dashboard', srcSet: '/media/interior-1200.webp 1200w, /media/interior-2400.webp 2400w' },
  { id: 'front', label: 'Front', src: '/media/view-front.webp', alt: 'Close view of the front fascia with LED headlamps and orange splitter' },
  { id: 'side', label: 'Side', src: '/media/view-side.webp', alt: 'Side profile of the car driving on a mountain road' },
  { id: 'rear', label: 'Rear', src: '/media/view-rear.webp', alt: 'Rear three-quarter view driving on a mountain road, light blade across the tail' },
];

export const COLORWAYS = [
  { id: 'obsidian', name: 'Obsidian Black', swatch: '#0b0b0c', filter: 'none', gel: 'transparent', note: 'Deep gloss black with orange accents.' },
  { id: 'titanium', name: 'Titanium Silver', swatch: '#a9adb2', filter: 'grayscale(1) brightness(1.75) contrast(1.05)', gel: 'rgba(205,210,216,0.10)', note: 'Brushed, cool metallic grade.' },
  { id: 'apex', name: 'Apex Orange', swatch: '#d2581c', filter: 'sepia(0.85) hue-rotate(-12deg) saturate(2.1) brightness(1.15) contrast(1.05)', gel: 'rgba(210,88,28,0.16)', note: 'Signature burnt-orange studio grade.' },
] as const;
