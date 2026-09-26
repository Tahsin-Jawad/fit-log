export interface Workout {
  id: string;
  title: string;
  description: string;
  category: string[];
  equipment: string;
  difficulty: string;
  sets: number;
  reps: string;
  duration: number; // in minutes
  calories: number;
  rating: number;
  image: string;
  instructions: string[];
}