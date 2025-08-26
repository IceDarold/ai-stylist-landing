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
  | { key: 'formality'; type: 'enum'; options: ('relaxed'|'smart_casual')[] }
  | { key: 'place'; type: 'enum'; options: ('restaurant'|'walk'|'cinema')[] }
  | { key: 'date_known'; type: 'enum'; options: ('yes'|'no')[] };

export interface UseCase {
  id: UseCaseId;
  title: string;
  icon: string;
  popular?: boolean;
  subprops?: UseCaseSubprop[];
}

export interface SelectedUseCase {
  id: UseCaseId;
  priority: 1|2|3;
  props?: Record<string,string>;
}

export const USECASES: UseCase[] = [
  {
    id: 'office',
    title: 'Офис',
    icon: '/icons/usecases/office.svg',
    popular: true,
    subprops: [
      { key: 'dress_code', type: 'enum', options: ['business_formal','smart_casual','free'] }
    ],
  },
  {
    id: 'everyday',
    title: 'Каждый день',
    icon: '/icons/usecases/everyday.svg',
    popular: true,
    subprops: [
      { key: 'formality', type: 'enum', options: ['relaxed','smart_casual'] }
    ],
  },
  {
    id: 'date',
    title: 'Свидание/вечер',
    icon: '/icons/usecases/date.svg',
    popular: true,
    subprops: [
      { key: 'place', type: 'enum', options: ['restaurant','walk','cinema'] }
    ],
  },
  {
    id: 'weekend',
    title: 'Выходные/кэжуал',
    icon: '/icons/usecases/weekend.svg',
    popular: true,
    subprops: [
      { key: 'formality', type: 'enum', options: ['relaxed','smart_casual'] }
    ],
  },
  {
    id: 'travel',
    title: 'Путешествие',
    icon: '/icons/usecases/travel.svg',
    popular: true,
    subprops: [
      { key: 'climate', type: 'enum', options: ['hot','mild','cold'] },
      { key: 'trip_duration', type: 'enum', options: ['2-3d','1w','2w+'] }
    ],
  },
  {
    id: 'season',
    title: 'Сезонная капсула',
    icon: '/icons/usecases/season.svg',
    popular: true,
    subprops: [
      { key: 'season', type: 'enum', options: ['ss','aw','spring','summer','autumn','winter'] }
    ],
  },
  {
    id: 'event',
    title: 'Событие',
    icon: '/icons/usecases/event.svg',
    popular: true,
    subprops: [
      { key: 'event_type', type: 'enum', options: ['wedding','grad','cocktail','corporate','other'] },
      { key: 'date_known', type: 'enum', options: ['yes','no'] }
    ],
  },
  // additional
  { id: 'business_trip', title: 'Бизнес-поездка', icon: '/icons/usecases/business_trip.svg' },
  { id: 'wedding_guest', title: 'Свадьба', icon: '/icons/usecases/wedding_guest.svg' },
  { id: 'party', title: 'Вечеринка/коктейль', icon: '/icons/usecases/party.svg' },
  { id: 'campus', title: 'Университет/кампус', icon: '/icons/usecases/campus.svg' },
  { id: 'athleisure', title: 'Спорт-шик', icon: '/icons/usecases/athleisure.svg' },
  { id: 'wardrobe_refresh', title: 'Обновление базы', icon: '/icons/usecases/wardrobe_refresh.svg' },
  { id: 'photo_shoot', title: 'Фотосессия', icon: '/icons/usecases/photo_shoot.svg' },
  { id: 'streetwear', title: 'Уличный стиль', icon: '/icons/usecases/streetwear.svg' },
  { id: 'vacation_beach', title: 'Отпуск-море', icon: '/icons/usecases/vacation_beach.svg' },
  { id: 'outdoor', title: 'Outdoor/погода', icon: '/icons/usecases/outdoor.svg' },
];

export const SUBPROP_LABELS: Record<string, Record<string, string>> = {
  dress_code: {
    business_formal: 'Business formal',
    smart_casual: 'Smart casual',
    free: 'Свободный',
  },
  climate: {
    hot: 'Жарко',
    mild: 'Умеренно',
    cold: 'Холодно',
  },
  trip_duration: {
    '2-3d': '2-3 дня',
    '1w': '1 неделя',
    '2w+': '2+ недели',
  },
  season: {
    ss: 'SS',
    aw: 'AW',
    spring: 'Весна',
    summer: 'Лето',
    autumn: 'Осень',
    winter: 'Зима',
  },
  event_type: {
    wedding: 'Свадьба',
    grad: 'Выпускной',
    cocktail: 'Коктейль',
    corporate: 'Корпоратив',
    other: 'Другое',
  },
  formality: {
    relaxed: 'Спокойно',
    smart_casual: 'Smart casual',
  },
  place: {
    restaurant: 'Ресторан',
    walk: 'Прогулка',
    cinema: 'Кино',
  },
  date_known: {
    yes: 'Дата известна',
    no: 'Дата не известна',
  },
};

