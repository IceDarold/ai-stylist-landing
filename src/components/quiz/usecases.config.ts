export type UseCaseId =
  | 'office'
  | 'everyday'
  | 'date'
  | 'weekend'
  | 'travel'
  | 'season'
  | 'event'
  | 'business_trip'
  | 'wedding_guest'
  | 'party'
  | 'campus'
  | 'athleisure'
  | 'wardrobe_refresh'
  | 'photo_shoot'
  | 'streetwear'
  | 'vacation_beach'
  | 'outdoor';

export type UseCaseSubprop =
  | { key: 'dress_code'; type: 'enum'; options: ('business_formal'|'smart_casual'|'free')[] }
  | { key: 'climate'; type: 'enum'; options: ('hot'|'mild'|'cold')[] }
  | { key: 'trip_duration'; type: 'enum'; options: ('2-3d'|'1w'|'2w+')[] }
  | { key: 'season'; type: 'enum'; options: ('ss'|'aw'|'spring'|'summer'|'autumn'|'winter')[] }
  | { key: 'event_type'; type: 'enum'; options: ('wedding'|'grad'|'cocktail'|'corporate'|'other')[] }
  | { key: 'date_known'; type: 'enum'; options: ('yes'|'no')[] }
  | { key: 'formality'; type: 'enum'; options: ('relaxed'|'smart_casual')[] }
  | { key: 'place'; type: 'enum'; options: ('restaurant'|'walk'|'cinema')[] };

export interface UseCase {
  id: UseCaseId;
  title: string;
  icon: string;
  popular?: boolean;
  subprops?: UseCaseSubprop[];
}

export type SelectedUseCase = {
  id: UseCaseId;
  priority: 1 | 2 | 3;
  props?: Record<string, string>;
};

export const USE_CASES: UseCase[] = [
  {
    id: 'office',
    title: 'Офис',
    icon: '/icons/usecases/office.png',
    popular: true,
  },
  {
    id: 'everyday',
    title: 'Каждый день',
    icon: '/icons/usecases/everyday.png',
    popular: true,
  },
  {
    id: 'date',
    title: 'Свидание/вечер',
    icon: '/icons/usecases/date.png',
    popular: true,
  },
  {
    id: 'weekend',
    title: 'Выходные/кэжуал',
    icon: '/icons/usecases/weekend.png',
    popular: true,
  },
  {
    id: 'travel',
    title: 'Путешествие',
    icon: '/icons/usecases/travel.png',
    popular: true,
  },
  {
    id: 'season',
    title: 'Сезонная капсула',
    icon: '/icons/usecases/season.png',
    popular: true,
  },
  {
    id: 'event',
    title: 'Событие',
    icon: '/icons/usecases/event.png',
    popular: true,
  },
  { id: 'business_trip', title: 'Бизнес-поездка', icon: '/icons/usecases/business_trip.svg' },
  { id: 'wedding_guest', title: 'Свадьба', icon: '/icons/usecases/wedding_guest.svg' },
  { id: 'party', title: 'Вечеринка/коктейль', icon: '/icons/usecases/party.svg' },
  { id: 'campus', title: 'Университет/кампус', icon: '/icons/usecases/campus.svg' },
  { id: 'athleisure', title: 'Спорт-шик/athleisure', icon: '/icons/usecases/athleisure.svg' },
  { id: 'wardrobe_refresh', title: 'Обновление базы', icon: '/icons/usecases/wardrobe_refresh.svg' },
  { id: 'photo_shoot', title: 'Фотосессия', icon: '/icons/usecases/photo_shoot.svg' },
  { id: 'streetwear', title: 'Уличный стиль', icon: '/icons/usecases/streetwear.svg' },
  { id: 'vacation_beach', title: 'Отпуск-море', icon: '/icons/usecases/vacation_beach.svg' },
];
