// Static data for the "A decade in the rankings" exhibits.
// Forked from decade-that-reshaped-higher-education.data.ts so this article can
// move its end year to 2027 without changing the sibling article.


/**
 * Region groupings collapsed from the original 6 to 4, recomputed directly
 * from content/data/regional-composition.json (THE Top 100 by region) so
 * the merge is exact, not eyeballed: Europe = Western Europe + Eastern
 * Europe (the latter is a single-institution, single-year blip); Asia =
 * East Asia + South & Southeast Asia (the latter is flat at 2% every year
 * and was never called out separately in the prose). The four bands sum
 * to ~100% every year, so "Other regions" is no longer needed.
 */
export const stackedAreaPaths = [
  // North America
  {
    d: 'M0,300 L74.5,300 L149.1,300 L223.6,300 L298.2,300 L372.7,300 L447.3,300 L521.8,300 L596.4,300 L670.9,300 L745.5,300 L820,300 L820,180 L745.5,186 L670.9,177 L596.4,183 L521.8,186 L447.3,171 L372.7,174 L298.2,165 L223.6,162 L149.1,159 L74.5,168 L0,171 Z',
    fill: '#1D383F',
  },
  // Europe
  {
    d: 'M0,171 L74.5,168 L149.1,159 L223.6,162 L298.2,165 L372.7,174 L447.3,171 L521.8,186 L596.4,183 L670.9,177 L745.5,186 L820,180 L820,81 L745.5,78 L670.9,69 L596.4,75 L521.8,78 L447.3,66 L372.7,66 L298.2,54 L223.6,54 L149.1,45 L74.5,51 L0,45 Z',
    fill: '#6B8B8E',
  },
  // Asia
  {
    d: 'M0,45 L74.5,51 L149.1,45 L223.6,54 L298.2,54 L372.7,66 L447.3,66 L521.8,78 L596.4,75 L670.9,69 L745.5,78 L820,81 L820,18 L745.5,18 L670.9,15 L596.4,18 L521.8,21 L447.3,18 L372.7,18 L298.2,18 L223.6,18 L149.1,12 L74.5,18 L0,18 Z',
    fill: '#A7B241',
  },
  // Oceania
  {
    d: 'M0,18 L74.5,18 L149.1,12 L223.6,18 L298.2,18 L372.7,18 L447.3,18 L521.8,21 L596.4,18 L670.9,15 L745.5,18 L820,18 L820,0 L745.5,0 L670.9,-3 L596.4,0 L521.8,0 L447.3,0 L372.7,0 L298.2,0 L223.6,0 L149.1,-6 L74.5,0 L0,0 Z',
    fill: '#6C6864',
  },
];

export const stackedAreaLegend = [
  { label: 'North America', color: '#1D383F' },
  { label: 'Europe', color: '#6B8B8E' },
  { label: 'Asia', color: '#A7B241' },
  { label: 'Oceania', color: '#6C6864' },
];

export const stackedAreaInlineLabels = [
  { x: 20, y: 236, text: 'North America' },
  { x: 20, y: 108, text: 'Europe' },
  { x: 738, y: 42, text: 'Asia' },
];

export const stackedAreaYears = [
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
  '2027',
];

export const gainers = [
  { name: 'China', value: 25, fill: '#2E5B66' },
  { name: 'Saudi Arabia', value: 8, fill: '#2E5B66' },
  { name: 'Malaysia', value: 7, fill: '#6C6864' },
  { name: 'United Arab Emirates', value: 6, fill: '#2E5B66' },
  { name: 'Germany', value: 6, fill: '#6C6864' },
  { name: 'Australia', value: 4, fill: '#6C6864' },
  { name: 'Korea, Republic of', value: 4, fill: '#6B8B8E' },
  { name: 'Iran, Islamic Rep. of', value: 3, fill: '#6B8B8E' },
];

export const decliners = [
  { name: 'Czechia', value: 2, fill: '#E8C7C2' },
  { name: 'Canada', value: 3, fill: '#E8C7C2' },
  { name: 'Spain', value: 3, fill: '#E8C7C2' },
  { name: 'Russian Federation', value: 6, fill: '#A0342A' },
  { name: 'Italy', value: 6, fill: '#A0342A' },
  { name: 'United Kingdom', value: 9, fill: '#A0342A' },
  { name: 'France', value: 10, fill: '#A0342A' },
  { name: 'United States', value: 26, fill: '#A0342A' },
];

export const risers = [
  { label: 'Shanghai Jiao Tong U.', fromRank: 40, toRank: 188, flag: 'China' },
  { label: 'Zhejiang University', fromRank: 39, toRank: 177, flag: 'China' },
  { label: 'Fudan University', fromRank: 36, toRank: 155, flag: 'China' },
  { label: 'Hong Kong Polytechnic U.', fromRank: 80, toRank: 192, flag: 'Hong Kong' },
  { label: 'Yonsei University', fromRank: 86, toRank: 197, flag: 'Korea, Republic of' },
  { label: 'Nanjing University', fromRank: 62, toRank: 169, flag: 'China' },
  { label: 'Charité Berlin', fromRank: 91, toRank: 195, flag: 'Germany' },
  { label: 'U. Sci. & Tech. of China', fromRank: 51, toRank: 153, flag: 'China' },
  { label: 'Chinese U. of Hong Kong', fromRank: 41, toRank: 138, flag: 'Hong Kong' },
  { label: 'KAIST', fromRank: 70, toRank: 148, flag: 'Korea, Republic of' },
  { label: 'Sungkyunkwan University', fromRank: 87, toRank: 153, flag: 'Korea, Republic of' },
  { label: 'KTH Royal Inst. of Tech.', fromRank: 98, toRank: 155, flag: 'Sweden' },
  { label: 'University of Hamburg', fromRank: 125, toRank: 180, flag: 'Germany' },
  { label: 'Newcastle University', fromRank: 144, toRank: 196, flag: 'United Kingdom' },
  { label: 'U. of Technology Sydney', fromRank: 145, toRank: 196, flag: 'Australia' },
];

export const countryTableRows = [
  { country: 'United States', qs17: 97, qs26: 71, qsD: { value: '-26', tone: 'neg' as const }, the16: 122, the26: 102, theD: { value: '-20', tone: 'neg' as const } },
  { country: 'United Kingdom', qs17: 51, qs26: 46, qsD: { value: '-5', tone: 'neg' as const }, the16: 58, the26: 49, theD: { value: '-9', tone: 'neg' as const } },
  { country: 'China', qs17: 24, qs26: 33, qsD: { value: '+9', tone: 'pos' as const }, the16: 11, the26: 35, theD: { value: '+24', tone: 'pos' as const } },
  { country: 'Germany', qs17: 31, qs26: 30, qsD: { value: '-1', tone: 'neg' as const }, the16: 36, the26: 41, theD: { value: '+5', tone: 'pos' as const } },
  { country: 'Australia', qs17: 23, qs26: 28, qsD: { value: '+5', tone: 'pos' as const }, the16: 27, the26: 32, theD: { value: '+5', tone: 'pos' as const } },
  { country: 'Italy', qs17: 12, qs26: 15, qsD: { value: '+3', tone: 'pos' as const }, the16: 33, the26: 25, theD: { value: '-8', tone: 'neg' as const } },
  { country: 'Spain', qs17: 10, qs26: 15, qsD: { value: '+5', tone: 'pos' as const }, the16: 9, the26: 5, theD: { value: '-4', tone: 'neg' as const } },
  { country: 'France', qs17: 20, qs26: 14, qsD: { value: '-6', tone: 'neg' as const }, the16: 20, the26: 11, theD: { value: '-9', tone: 'neg' as const } },
  { country: 'Canada', qs17: 18, qs26: 18, qsD: '+0', the16: 21, the26: 18, theD: { value: '-3', tone: 'neg' as const } },
  { country: 'Korea, Republic of', qs17: 16, qs26: 13, qsD: { value: '-3', tone: 'neg' as const }, the16: 11, the26: 14, theD: { value: '+3', tone: 'pos' as const } },
  { country: 'Japan', qs17: 17, qs26: 13, qsD: { value: '-4', tone: 'neg' as const }, the16: 11, the26: 9, theD: { value: '-2', tone: 'neg' as const } },
  { country: 'Netherlands', qs17: 13, qs26: 13, qsD: '+0', the16: 13, the26: 12, theD: { value: '-1', tone: 'neg' as const } },
  { country: 'Saudi Arabia', qs17: 3, qs26: 5, qsD: { value: '+2', tone: 'pos' as const }, the16: 1, the26: 9, theD: { value: '+8', tone: 'pos' as const } },
  { country: 'Malaysia', qs17: 5, qs26: 10, qsD: { value: '+5', tone: 'pos' as const }, the16: 1, the26: 7, theD: { value: '+6', tone: 'pos' as const } },
  { country: 'United Arab Emirates', qs17: 3, qs26: 6, qsD: { value: '+3', tone: 'pos' as const }, the16: 0, the26: 7, theD: { value: '+7', tone: 'pos' as const } },
];

/** Short display labels for the country table, where the full name doesn't fit on one line. */
export const countryShortNames: Record<string, string> = {
  'United States': 'USA',
  'United Kingdom': 'UK',
  'Korea, Republic of': 'Korea',
  'United Arab Emirates': 'UAE',
};
