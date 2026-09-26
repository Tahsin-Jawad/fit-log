import { Workout } from '@/types';

const API_URL = 'https://api.abcz.workers.dev/api/fitlog';

export async function fetchWorkouts(): Promise<Workout[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch workouts');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
}

export async function fetchWorkoutById(id: string): Promise<Workout | null> {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch workout details');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching workout details:', error);
    return null;
  }
}