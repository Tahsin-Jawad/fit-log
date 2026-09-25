export interface Workout {
  id: string;
  title?: string;
  name?: string;
  category?: string;
  duration?: number | string;
  calories?: number | string;
  description?: string;
  exercises?: Array<any>;
}