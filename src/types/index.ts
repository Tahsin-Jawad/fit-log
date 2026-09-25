export interface Workout {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  duration: number;
  calories: number;
  image: string;
  description: string;
  instructions: string[];
}