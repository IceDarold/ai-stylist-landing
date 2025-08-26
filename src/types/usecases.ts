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
  | { key: 'dress_code'; type: 'enum'; options: ('business_formal' | 'smart_casual' | 'free')[] }
  | { key: 'climate'; type: 'enum'; options: ('hot' | 'mild' | 'cold')[] }
  | { key: 'trip_duration'; type: 'enum'; options: ('2-3d' | '1w' | '2w+')[] }
  | { key: 'season'; type: 'enum'; options: ('ss' | 'aw' | 'spring' | 'summer' | 'autumn' | 'winter')[] }
  | { key: 'event_type'; type: 'enum'; options: ('wedding' | 'grad' | 'cocktail' | 'corporate' | 'other')[] }
  | { key: 'formality'; type: 'enum'; options: ('relaxed' | 'smart_casual')[] }
  | { key: 'place'; type: 'enum'; options: ('restaurant' | 'walk' | 'cinema')[] };

export interface UseCase {
  id: UseCaseId;
  title: string;
  icon: string;
  popular?: boolean;
  subprops?: UseCaseSubprop[];
}

export interface SelectedUseCase {
  id: UseCaseId;
  priority: 1 | 2 | 3;
  props?: Record<string, string>;
}
