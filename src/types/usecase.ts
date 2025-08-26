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

export interface UseCaseSubpropOption {
  key:
    | 'dress_code'
    | 'climate'
    | 'trip_duration'
    | 'season'
    | 'event_type'
    | 'formality'
    | 'place';
  type: 'enum';
  options: string[];
}

export interface UseCase {
  id: UseCaseId;
  title: string;
  icon: string;
  popular?: boolean;
  subprops?: UseCaseSubpropOption[];
}

export interface SelectedUseCase {
  id: UseCaseId;
  priority: 1 | 2 | 3;
  props?: Record<string, string>;
}
