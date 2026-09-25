import { Workout } from '@/types';

const API_BASE_URL = 'https://api.abcz.workers.dev/api/fitlog';

export async function fetchWorkouts(): Promise<Workout[]> {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts data');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.workouts || [];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
}

export async function fetchWorkoutById(id: string): Promise<Workout | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (response.ok) {
      const data = await response.json();
      if (data) return data;
    }

    const workouts = await fetchWorkouts();
    const found = workouts.find((w: any) => String(w.id) === String(id));
    return found || null;
  } catch (error) {
    console.error(`Error fetching workout with id ${id}:`, error);
    return null;
  }
}