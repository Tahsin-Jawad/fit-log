import { Workout } from '@/types';

export const workoutsData: Workout[] = [
  {
    id: '1',
    title: 'BARBELL BENCH PRESS',
    category: 'CHEST',
    duration: 45,
    calories: 320,
    image: '/images/workout-avatar.png', 
    description: 'A compound exercise that builds strength and muscle mass in the chest, shoulders, and triceps.',
    instructions: [
      'Lie flat on the bench with your eyes under the bar.',
      'Grip the bar slightly wider than shoulder-width apart.',
      'Unrack the bar and lower it slowly to your mid-chest.',
      'Press the bar back up explosively to the starting position.'
    ]
  },
  {
    id: '2',
    title: 'PULL UP',
    category: 'BACK',
    duration: 30,
    calories: 250,
    image: '/images/workout-avatar.png',
    description: 'An upper-body exercise that targets the latissimus dorsi and upper back muscles.',
    instructions: [
      'Grab the pull-up bar with an overhand grip wider than shoulder-width.',
      'Hang with your arms fully extended and core engaged.',
      'Pull your chest up to the bar by driving your elbows down.',
      'Lower yourself back down in a controlled motion.'
    ]
  },
  {
    id: '3',
    title: 'BARBELL SQUAT',
    category: 'LEGS',
    duration: 50,
    calories: 400,
    image: '/images/workout-avatar.png',
    description: 'The king of lower-body exercises, targeting quadriceps, hamstrings, and glutes.',
    instructions: [
      'Position the barbell across your upper back and traps.',
      'Stand with feet shoulder-width apart and toes pointing slightly outward.',
      'Bend at your hips and knees to lower your body as if sitting in a chair.',
      'Push through your heels to return to the starting position.'
    ]
  },
  {
    id: '4',
    title: 'OVERHEAD PRESS',
    category: 'SHOULDERS',
    duration: 40,
    calories: 280,
    image: '/images/workout-avatar.png',
    description: 'A powerful upper body lift for building shoulder strength and stability.',
    instructions: [
      'Hold the barbell at shoulder height with a grip slightly wider than shoulder-width.',
      'Brace your core and squeeze your glutes.',
      'Press the bar straight overhead until your arms are fully locked out.',
      'Lower the bar back to the starting position safely.'
    ]
  },
  {
    id: '5',
    title: 'BARBELL ROW',
    category: 'BACK',
    duration: 40,
    calories: 300,
    image: '/images/workout-avatar.png',
    description: 'An effective compound movement for building a thick and strong back.',
    instructions: [
      'Hinge at your hips with a slight bend in your knees, holding the barbell.',
      'Keep your back straight and core tight.',
      'Pull the barbell towards your lower ribcage, squeezing your shoulder blades.',
      'Lower the weight back down with control.'
    ]
  },
  {
    id: '6',
    title: 'DUMBBELL BICEP CURL',
    category: 'ARMS',
    duration: 25,
    calories: 180,
    image: '/images/workout-avatar.png',
    description: 'An isolation exercise focused on developing the biceps brachii.',
    instructions: [
      'Stand tall holding dumbbells at your sides with palms facing forward.',
      'Keep your elbows close to your torso at all times.',
      'Curl the weights upward while contracting your biceps.',
      'Slowly lower the dumbbells back to the starting position.'
    ]
  },
  {
    id: '7',
    title: 'TRICEP PUSHDOWN',
    category: 'ARMS',
    duration: 25,
    calories: 170,
    image: '/images/workout-avatar.png',
    description: 'A cable exercise designed to isolate and build the triceps muscles.',
    instructions: [
      'Attach a straight bar or rope to a high pulley cable machine.',
      'Keep your elbows fixed by your sides.',
      'Push the attachment downward by extending your arms.',
      'Return slowly to the starting position without letting your elbows flare out.'
    ]
  },
  {
    id: '8',
    title: 'BULGARIAN SPLIT SQUAT',
    category: 'LEGS',
    duration: 35,
    calories: 310,
    image: '/images/workout-avatar.png',
    description: 'A unilateral leg exercise that builds strength, balance, and stability.',
    instructions: [
      'Stand a couple of feet in front of a bench, facing away from it.',
      'Place one foot behind you on the bench resting on the toes.',
      'Lower your hips until your back knee is just above the floor.',
      'Drive through your front heel to return to the starting position.'
    ]
  },
  {
    id: '9',
    title: 'DEADLIFT',
    category: 'BACK',
    duration: 50,
    calories: 450,
    image: '/images/workout-avatar.png',
    description: 'A fundamental full-body compound movement that builds massive posterior chain strength.',
    instructions: [
      'Stand with your mid-foot under the barbell.',
      'Hinge at the hips and grip the bar just outside your legs.',
      'Keep your back flat, chest up, and pull the slack out of the bar.',
      'Drive through the floor and lock out your hips at the top.'
    ]
  },
  {
    id: '10',
    title: 'PLANK',
    category: 'CORE',
    duration: 20,
    calories: 120,
    image: '/images/workout-avatar.png',
    description: 'An isometric core strength exercise that improves posture and stability.',
    instructions: [
      'Start in a forearm plank position with elbows under your shoulders.',
      'Keep your body in a straight line from head to heels.',
      'Engage your core, glutes, and quadriceps tightly.',
      'Hold this position for the desired duration without letting your hips sag.'
    ]
  },
  {
    id: '11',
    title: 'SEATED CABLE ROW',
    category: 'BACK',
    duration: 30,
    calories: 240,
    image: '/images/workout-avatar.png',
    description: 'A seated rowing movement that targets the middle back and lats safely.',
    instructions: [
      'Sit on the machine with your feet secured and grab the handle.',
      'Keep your chest proud and a slight bend in your knees.',
      'Pull the handle towards your abdomen while squeezing your back.',
      'Extend your arms forward slowly to return to the starting position.'
    ]
  },
  {
    id: '12',
    title: 'LEG PRESS',
    category: 'LEGS',
    duration: 35,
    calories: 290,
    image: '/images/workout-avatar.png',
    description: 'A machine-based compound exercise for heavy lower body training.',
    instructions: [
      'Sit on the leg press machine with your feet shoulder-width apart on the platform.',
      'Release the safety handles and lower the weight towards you smoothly.',
      'Ensure your knees do not cave inward during the movement.',
      'Press the platform back up without locking your knees completely.'
    ]
  }
];