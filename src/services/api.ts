import { Workout } from '@/types';

const API_BASE_URL = 'https://api.abcz.workers.dev/api/fitlog';

export async function fetchWorkouts(): Promise<Workout[]> {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
}

export async function fetchWorkoutById(id: string): Promise<Workout | null> {
  try {
    const response = await `${API_BASE_URL}/${id}`;
    // Fetching single workout logic here
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch workout details');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching workout with id ${id}:`, error);
    return null;
  }
}