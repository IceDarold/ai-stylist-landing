import type { UseCase } from "@/types/usecases";

export const USE_CASES: UseCase[] = [
  {
    id: 'office',
    title: 'Офис',
    icon: '/icons/usecases/placeholder.svg',
    popular: true,
    subprops: [
      { key: 'dress_code', type: 'enum', options: ['business_formal', 'smart_casual', 'free'] },
    ],
  },
  {
    id: 'everyday',
    title: 'Каждый день',
    icon: '/icons/usecases/placeholder.svg',
    popular: true,
    subprops: [
      { key: 'formality', type: 'enum', options: ['relaxed', 'smart_casual'] },
    ],
  },
  {
    id: 'date',
    title: 'Свидание/вечер',
    icon: '/icons/usecases/placeholder.svg',
    popular: true,
    subprops: [
      { key: 'place', type: 'enum', options: ['restaurant', 'walk', 'cinema'] },
    ],
  },
  {
    id: 'weekend',
    title: 'Выходные/кэжуал',
    icon: '/icons/usecases/placeholder.svg',
    popular: true,
    subprops: [
      { key: 'formality', type: 'enum', options: ['relaxed', 'smart_casual'] },
    ],
  },
  {
    id: 'travel',
    title: 'Путешествие',
    icon: '/icons/usecases/placeholder.svg',
    popular: true,
    subprops: [
      { key: 'climate', type: 'enum', options: ['hot', 'mild', 'cold'] },
      { key: 'trip_duration', type: 'enum', options: ['2-3d', '1w', '2w+'] },
    ],
  },
  {
    id: 'season',
    title: 'Сезонная капсула',
    icon: '/icons/usecases/placeholder.svg',
    popular: true,
    subprops: [
      { key: 'season', type: 'enum', options: ['ss', 'aw'] },
    ],
  },
  {
    id: 'event',
    title: 'Событие',
    icon: '/icons/usecases/placeholder.svg',
    popular: true,
    subprops: [
      { key: 'event_type', type: 'enum', options: ['wedding', 'grad', 'cocktail', 'corporate', 'other'] },
    ],
  },
  { id: 'business_trip', title: 'Бизнес-поездка', icon: '/icons/usecases/placeholder.svg' },
  { id: 'wedding_guest', title: 'Свадьба', icon: '/icons/usecases/placeholder.svg' },
  { id: 'party', title: 'Вечеринка/коктейль', icon: '/icons/usecases/placeholder.svg' },
  { id: 'campus', title: 'Университет/кампус', icon: '/icons/usecases/placeholder.svg' },
  { id: 'athleisure', title: 'Спорт-шик', icon: '/icons/usecases/placeholder.svg' },
  { id: 'wardrobe_refresh', title: 'Обновление базы', icon: '/icons/usecases/placeholder.svg' },
  { id: 'photo_shoot', title: 'Фотосессия', icon: '/icons/usecases/placeholder.svg' },
  { id: 'streetwear', title: 'Уличный стиль', icon: '/icons/usecases/placeholder.svg' },
  { id: 'vacation_beach', title: 'Отпуск-море', icon: '/icons/usecases/placeholder.svg' },
  { id: 'outdoor', title: 'Outdoor/погода', icon: '/icons/usecases/placeholder.svg' },
];
