export const CityIds = {
  TEHRAN: 'tehran',
  YAZD: 'yazd',
  MASHHAD: 'mashhad',
  ISFAHAN: 'isfahan'
};

export const CityLabels = {
  [CityIds.TEHRAN]: 'تهران',
  [CityIds.YAZD]: 'یزد',
  [CityIds.MASHHAD]: 'مشهد',
  [CityIds.ISFAHAN]: 'اصفهان'
};

export const CITIES = Object.entries(CityIds).map(([key, id]) => ({
  id,
  label: CityLabels[id]
}));

export default CITIES;
