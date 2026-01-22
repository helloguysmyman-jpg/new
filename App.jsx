import React, { useState } from 'react';
import { Dumbbell, Target, Clock, Zap, ChevronRight, Play, Check, User, TrendingUp } from 'lucide-react';

export default function GoalieWorkoutApp() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userProfile, setUserProfile] = useState({
    level: '',
    position: 'goalie',
    weaknesses: [],
    goals: [],
    email: '',
    points: 0,
    streak: 0,
    lastWorkoutDate: null,
    totalWorkouts: 0
  });
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseSets, setExerciseSets] = useState({}); // Track completed sets per exercise
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showPointsNotification, setShowPointsNotification] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(new Date().toDateString());
  const [isRestTimer, setIsRestTimer] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [activeWorkoutLevel, setActiveWorkoutLevel] = useState(null); // Track which level's workout is active

  // Load saved data on mount
  React.useEffect(() => {
    const savedData = localStorage.getItem('goalieWorkoutData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const today = new Date().toDateString();
      
      // Check if it's a new day - if so, reset workout progress but keep profile
      if (parsed.workoutDate !== today) {
        setUserProfile(parsed.userProfile || userProfile);
        setEmailInput(parsed.userProfile?.email || '');
        setWorkoutDate(today);
        // Reset workout progress for new day
        setExerciseSets({});
        setCompletedExercises([]);
        setActiveWorkoutLevel(null);
      } else {
        // Same day - restore everything
        setUserProfile(parsed.userProfile || userProfile);
        setExerciseSets(parsed.exerciseSets || {});
        setCompletedExercises(parsed.completedExercises || []);
        setEmailInput(parsed.userProfile?.email || '');
        setWorkoutDate(parsed.workoutDate || today);
        setActiveWorkoutLevel(parsed.activeWorkoutLevel || null);
        if (parsed.activeWorkout) {
          setActiveWorkout(parsed.activeWorkout);
        }
      }
    }
  }, []);

  // Save data whenever it changes
  React.useEffect(() => {
    const dataToSave = {
      userProfile,
      exerciseSets,
      completedExercises,
      workoutDate,
      activeWorkout,
      activeWorkoutLevel
    };
    localStorage.setItem('goalieWorkoutData', JSON.stringify(dataToSave));
  }, [userProfile, exerciseSets, completedExercises, workoutDate, activeWorkout, activeWorkoutLevel]);

  const workoutPrograms = {
    beginner: {
      title: "Foundation Builder",
      focus: "Core strength & basic reflexes",
      weeks: 4,
      exercises: [
        { 
          id: 1, 
          name: "Butterfly Stretch Hold", 
          sets: 3,
          duration: "45s",
          isTimeBased: true,
          timeInSeconds: 45,
          restTime: 30, // 30 seconds rest between sets
          target: "Hip Flexibility", 
          difficulty: "Beginner",
          description: "Sit on the floor with soles of feet together, knees bent out to sides. Hold your feet and gently press knees toward the floor. Keep your back straight and lean forward slightly from the hips.",
          image: "🦋",
          tips: "Breathe deeply and relax into the stretch. Don't bounce—hold steady."
        },
        { 
          id: 2, 
          name: "Plank Series", 
          sets: 3,
          duration: "30s each",
          isTimeBased: true,
          timeInSeconds: 30,
          restTime: 45, // 45 seconds rest for core work
          target: "Core Stability", 
          difficulty: "Beginner",
          description: "Hold a forearm plank position, then side planks on both sides. Keep body in a straight line from head to heels. Engage your core and don't let hips sag.",
          image: "💪",
          tips: "Focus on breathing steadily. Squeeze your glutes to maintain alignment."
        },
        { 
          id: 3, 
          name: "Lateral Shuffle Drills", 
          sets: 4,
          duration: "20s",
          isTimeBased: true,
          timeInSeconds: 20,
          restTime: 40, // 40 seconds rest for cardio
          target: "Lateral Movement", 
          difficulty: "Beginner",
          description: "In an athletic stance, shuffle side-to-side maintaining low posture. Stay on the balls of your feet. Don't cross feet—push off the trailing leg.",
          image: "⚡",
          tips: "Keep chest up and knees bent. Explode off each push."
        },
        { 
          id: 4, 
          name: "Glute Bridges", 
          sets: 3,
          duration: "15 reps",
          isTimeBased: false,
          restTime: 45, // 45 seconds rest for strength
          target: "Hip Power", 
          difficulty: "Beginner",
          description: "Lie on back with knees bent, feet flat. Lift hips by squeezing glutes until body forms a straight line from shoulders to knees. Hold at top for 2 seconds.",
          image: "🏋️",
          tips: "Drive through your heels. Don't arch your lower back."
        },
        { 
          id: 5, 
          name: "Wall Sits", 
          sets: 3,
          duration: "45s",
          isTimeBased: true,
          timeInSeconds: 45,
          restTime: 60, // 60 seconds rest for isometric holds
          target: "Leg Endurance", 
          difficulty: "Beginner",
          description: "Lean back against wall and slide down until thighs are parallel to ground. Keep knees at 90 degrees directly above ankles. Hold position.",
          image: "🧱",
          tips: "Press back firmly into wall. Keep weight in heels."
        }
      ]
    },
    intermediate: {
      title: "Elite Reflex Training",
      focus: "Explosive power & reaction speed",
      weeks: 6,
      exercises: [
        { 
          id: 1, 
          name: "Box Jumps", 
          sets: 4,
          duration: "10 reps",
          isTimeBased: false,
          restTime: 90, // 90 seconds for explosive movements
          target: "Explosive Power", 
          difficulty: "Intermediate",
          description: "From athletic stance, explosively jump onto a box or platform. Land softly with bent knees. Step down and reset. Focus on quick, powerful takeoffs.",
          image: "📦",
          tips: "Swing arms for momentum. Land soft, absorb with your legs."
        },
        { 
          id: 2, 
          name: "Single-Leg RDLs", 
          sets: 3,
          duration: "12 reps/leg",
          isTimeBased: false,
          restTime: 60, // 60 seconds for balance work
          target: "Balance & Posterior Chain", 
          difficulty: "Intermediate",
          description: "Balance on one leg, hinge at hip while extending other leg back. Keep back straight and lower torso until parallel to ground. Return to start.",
          image: "🦩",
          tips: "Keep slight bend in standing knee. Focus on a spot for balance."
        },
        { 
          id: 3, 
          name: "Medicine Ball Slams", 
          sets: 4,
          duration: "15 reps",
          isTimeBased: false,
          restTime: 60, // 60 seconds for power work
          target: "Core Explosiveness", 
          difficulty: "Intermediate",
          description: "Hold medicine ball overhead, then explosively slam it to the ground using your entire body. Catch on bounce and repeat with maximum power.",
          image: "⚫",
          tips: "Use your core and full body, not just arms. Slam with aggression!"
        },
        { 
          id: 4, 
          name: "Lateral Bound Series", 
          sets: 4,
          duration: "8/side",
          isTimeBased: false,
          restTime: 75, // 75 seconds for plyometrics
          target: "Lateral Explosiveness", 
          difficulty: "Intermediate",
          description: "Jump laterally from one leg to the other, pushing off explosively. Land on outside leg and stick the landing before exploding to other side.",
          image: "↔️",
          tips: "Drive off outside edge of foot. Control your landing."
        },
        { 
          id: 5, 
          name: "Reaction Ball Training", 
          sets: 5,
          duration: "45s",
          isTimeBased: true,
          timeInSeconds: 45,
          restTime: 30, // 30 seconds for skill work
          target: "Hand-Eye Coordination", 
          difficulty: "Intermediate",
          description: "Throw reaction ball against wall or ground and catch its unpredictable bounce. React quickly to changes in direction. Mix up throwing angles.",
          image: "🎾",
          tips: "Keep hands ready. Track the ball from release to catch."
        },
        { 
          id: 6, 
          name: "Butterfly Push-offs", 
          sets: 4,
          duration: "12 reps",
          isTimeBased: false,
          restTime: 60, // 60 seconds for explosive movement
          target: "Recovery Speed", 
          difficulty: "Intermediate",
          description: "Start in butterfly position. Explosively push off one leg to standing position, then drop back to butterfly. Alternate sides. Focus on speed.",
          image: "🚀",
          tips: "Push hard through the ice. Make it explosive and quick."
        }
      ]
    },
    advanced: {
      title: "Pro Performance Protocol",
      focus: "Maximum explosiveness & endurance",
      weeks: 8,
      exercises: [
        { 
          id: 1, 
          name: "Depth Jumps to Box", 
          sets: 5,
          duration: "6 reps",
          isTimeBased: false,
          restTime: 120, // 2 minutes for max plyometrics
          target: "Plyometric Power", 
          difficulty: "Advanced",
          description: "Step off elevated platform, immediately explode upward onto higher box upon landing. Minimize ground contact time. Focus on reactive strength.",
          image: "⬆️",
          tips: "Land soft, explode fast. Quick ground contact is key."
        },
        { 
          id: 2, 
          name: "Weighted Butterfly Transitions", 
          sets: 4,
          duration: "10 reps",
          isTimeBased: false,
          restTime: 90, // 90 seconds for weighted explosive work
          target: "Butterfly Speed", 
          difficulty: "Advanced",
          description: "Wearing weight vest or holding dumbbells, drop into butterfly position and explosively return to standing. Repeat with speed and control.",
          image: "⚖️",
          tips: "Keep core tight. Don't let weight slow your explosiveness."
        },
        { 
          id: 3, 
          name: "Single-Leg Box Jumps", 
          sets: 4,
          duration: "8/leg",
          isTimeBased: false,
          restTime: 120, // 2 minutes for unilateral plyos
          target: "Unilateral Power", 
          difficulty: "Advanced",
          description: "Jump onto box using only one leg. Land softly on same leg. Step down and repeat. Builds explosive power and balance for push-offs.",
          image: "1️⃣",
          tips: "Swing opposite leg and arms. Balance on landing before stepping down."
        },
        { 
          id: 4, 
          name: "Lateral Sled Drags", 
          sets: 5,
          duration: "20m",
          isTimeBased: false,
          restTime: 90, // 90 seconds for loaded movement
          target: "Lateral Strength", 
          difficulty: "Advanced",
          description: "Attach sled harness, assume goalie stance. Shuffle laterally dragging sled resistance. Stay low and maintain athletic posture throughout.",
          image: "🛷",
          tips: "Push through entire foot. Keep weight on balls of feet."
        },
        { 
          id: 5, 
          name: "Kettlebell Swings", 
          sets: 4,
          duration: "20 reps",
          isTimeBased: false,
          restTime: 75, // 75 seconds for ballistic work
          target: "Hip Explosiveness", 
          difficulty: "Advanced",
          description: "Hinge at hips, swing kettlebell between legs, then explosively drive hips forward to swing weight to shoulder height. Power comes from hips, not arms.",
          image: "🔥",
          tips: "Snap hips forward. Keep arms relaxed—they're just holding on."
        },
        { 
          id: 6, 
          name: "Agility Ladder Complex", 
          sets: 6,
          duration: "30s",
          isTimeBased: true,
          timeInSeconds: 30,
          restTime: 45, // 45 seconds for agility work
          target: "Footwork Speed", 
          difficulty: "Advanced",
          description: "Perform various footwork patterns through ladder: in-out, lateral shuffles, ickey shuffle, crossovers. Focus on quick, precise foot placement.",
          image: "🪜",
          tips: "Stay on balls of feet. Speed AND precision matter equally."
        },
        { 
          id: 7, 
          name: "Resistance Band Saves", 
          sets: 4,
          duration: "15 reps/side",
          isTimeBased: false,
          restTime: 60, // 60 seconds for technical work
          target: "Save Mechanics", 
          difficulty: "Advanced",
          description: "Attach resistance bands to simulate save resistance. Practice glove saves, blocker saves, and paddle downs against band tension. Maintain proper form.",
          image: "🥅",
          tips: "Fight through the resistance. Perfect technique under load."
        }
      ]
    }
  };

  const handleOnboardingComplete = (level) => {
    setIsTransitioning(true);
    setTimeout(() => {
      // If changing levels, reset workout progress
      if (userProfile.level && userProfile.level !== level) {
        setExerciseSets({});
        setCompletedExercises([]);
        setActiveWorkout(null);
        setActiveWorkoutLevel(null);
      }
      
      setUserProfile({ ...userProfile, level });
      setCurrentView('dashboard');
      setIsTransitioning(false);
      // Show email alert on first visit
      if (!userProfile.email) {
        setTimeout(() => setShowEmailAlert(true), 1000);
      }
    }, 300);
  };

  const navigateTo = (view) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 300);
  };

  const calculatePoints = (exerciseDifficulty, isTimeBased) => {
    let points = 10; // Base points per set
    
    // Difficulty multiplier
    if (exerciseDifficulty === 'Intermediate') points *= 1.5;
    if (exerciseDifficulty === 'Advanced') points *= 2;
    
    // Time-based exercises get bonus
    if (isTimeBased) points += 5;
    
    return Math.round(points);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastWorkout = userProfile.lastWorkoutDate;
    
    if (!lastWorkout) {
      // First workout ever
      return 1;
    }
    
    const lastDate = new Date(lastWorkout);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate.toDateString() === today) {
      // Already worked out today
      return userProfile.streak;
    } else if (lastDate.toDateString() === yesterday.toDateString()) {
      // Consecutive day
      return userProfile.streak + 1;
    } else {
      // Streak broken
      return 1;
    }
  };

  const awardPoints = (points) => {
    setPointsEarned(points);
    setUserProfile(prev => ({
      ...prev,
      points: prev.points + points
    }));
    setShowPointsNotification(true);
    setTimeout(() => setShowPointsNotification(false), 2000);
  };

  const getNextIncompleteExercise = () => {
    if (!activeWorkout) return null;
    
    // Find first exercise that hasn't completed all sets
    for (const exercise of activeWorkout.exercises) {
      const completedSets = exerciseSets[exercise.id] || 0;
      if (completedSets < exercise.sets) {
        return exercise;
      }
    }
    
    return null; // All exercises complete
  };

  // Function to check if workout is complete for the day (must be same level)
  const isWorkoutComplete = () => {
    if (!activeWorkout || !activeWorkoutLevel) return false;
    // Only consider complete if the workout was for the current user level
    if (activeWorkoutLevel !== userProfile.level) return false;
    
    return activeWorkout.exercises.every(ex => {
      const completedSets = exerciseSets[ex.id] || 0;
      return completedSets >= ex.sets;
    });
  };

  const startWorkout = (program) => {
    const today = new Date().toDateString();
    
    // Set the active workout level
    setActiveWorkoutLevel(userProfile.level);
    
    // Only reset if it's a different workout or explicitly starting fresh
    if (!activeWorkout || activeWorkout.title !== program.title) {
      setActiveWorkout(program);
    } else {
      setActiveWorkout(program);
    }
    
    // Update streak and award streak bonus
    const newStreak = updateStreak();
    const oldStreak = userProfile.streak;
    
    setUserProfile(prev => ({
      ...prev,
      streak: newStreak,
      lastWorkoutDate: today
    }));
    
    // Award points for maintaining/building streak
    if (newStreak > oldStreak && newStreak > 1) {
      // Continuing streak - award bonus points
      const streakBonus = newStreak * 10; // 10 points per day in streak
      awardPoints(streakBonus);
    }
    
    setWorkoutDate(today);
    setCurrentView('workout');
  };

  const completeSet = (exerciseId, totalSets, exercise) => {
    const currentSets = exerciseSets[exerciseId] || 0;
    const newSets = currentSets + 1;
    
    setExerciseSets({
      ...exerciseSets,
      [exerciseId]: newSets
    });

    // Award points for completing the set
    const points = calculatePoints(exercise.difficulty, exercise.isTimeBased);
    awardPoints(points);

    // If all sets are complete for this exercise, mark it as done
    if (newSets >= totalSets) {
      if (!completedExercises.includes(exerciseId)) {
        setCompletedExercises([...completedExercises, exerciseId]);
        // Bonus points for completing all sets of an exercise
        awardPoints(points * 2);
      }
    }

    // Check if entire workout is complete
    const allExercisesComplete = activeWorkout.exercises.every(ex => {
      const sets = ex.id === exerciseId ? newSets : (exerciseSets[ex.id] || 0);
      return sets >= ex.sets;
    });

    // Start rest timer or complete workout
    setTimeout(() => {
      if (allExercisesComplete) {
        // All exercises complete!
        setSelectedExercise(null);
        // Mega bonus for completing entire workout
        awardPoints(100);
        // Increment total workouts
        setUserProfile(prev => ({
          ...prev,
          totalWorkouts: prev.totalWorkouts + 1
        }));
      } else {
        // Start rest timer before next exercise
        console.log('About to start rest timer, exercise:', exercise, 'restTime:', exercise.restTime);
        startRestTimer(exercise.restTime);
      }
    }, 1000); // Brief delay to show the completion
  };

  const startTimer = (seconds) => {
    setTimeRemaining(seconds);
    setTimerActive(true);
    setIsRestTimer(false);
  };

  const stopTimer = () => {
    setTimerActive(false);
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  };

  const resetTimer = (seconds) => {
    stopTimer();
    setTimeRemaining(seconds);
  };

  const startRestTimer = (seconds) => {
    console.log('Starting rest timer for', seconds, 'seconds');
    setRestTimeRemaining(seconds);
    setRestTimerActive(true);
  };

  const skipRest = () => {
    setRestTimerActive(false);
    setRestTimeRemaining(0);
    // Move to next exercise immediately
    const nextExercise = getNextIncompleteExercise();
    if (nextExercise) {
      setSelectedExercise(nextExercise);
      stopTimer();
      setTimeRemaining(0);
    } else {
      setSelectedExercise(null);
    }
  };

  // Rest timer effect
  React.useEffect(() => {
    if (restTimerActive && restTimeRemaining > 0) {
      const interval = setInterval(() => {
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            setRestTimerActive(false);
            clearInterval(interval);
            
            // Auto-navigate to next exercise after rest
            const nextExercise = getNextIncompleteExercise();
            if (nextExercise) {
              setSelectedExercise(nextExercise);
              stopTimer();
              setTimeRemaining(0);
            } else {
              setSelectedExercise(null);
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [restTimerActive]);

  // Timer effect - auto-complete set when timer reaches 0
  React.useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            clearInterval(interval);
            
            // Auto-complete the set when timer finishes
            if (selectedExercise) {
              completeSet(selectedExercise.id, selectedExercise.sets, selectedExercise);
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [timerActive]);

  // Separate effect to handle timeRemaining changes
  React.useEffect(() => {
    if (!timerActive && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendProgressEmail = async () => {
    if (!emailInput) return;

    const totalExercises = activeWorkout.exercises.length;
    const totalSets = activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedSetsCount = Object.values(exerciseSets).reduce((sum, sets) => sum + sets, 0);
    const completionPercentage = Math.round((completedSetsCount / totalSets) * 100);

    const report = {
      date: new Date().toLocaleDateString(),
      program: activeWorkout.title,
      level: userProfile.level,
      totalPoints: userProfile.points,
      currentStreak: userProfile.streak,
      totalExercises,
      completedExercises: completedExercises.length,
      totalSets,
      completedSets: completedSetsCount,
      completionPercentage,
      exercises: activeWorkout.exercises.map(ex => ({
        name: ex.name,
        completedSets: exerciseSets[ex.id] || 0,
        totalSets: ex.sets
      }))
    };

    // Simulate email sending (in production, this would call an API)
    console.log('Sending email to:', emailInput);
    console.log('Progress report:', report);
    
    setEmailSent(true);
    setUserProfile({ ...userProfile, email: emailInput });
    
    setTimeout(() => {
      setShowEmailModal(false);
      setEmailSent(false);
    }, 2000);
  };

  // Onboarding View
  if (currentView === 'onboarding') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 font-sans ${isTransitioning ? 'page-transition-exit' : 'page-transition-enter'}`}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          
          .goalie-title {
            font-family: 'Bebas Neue', sans-serif;
            letter-spacing: 0.05em;
          }
          
          .level-card {
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%);
            border: 2px solid rgba(59, 130, 246, 0.3);
            overflow: hidden;
          }
          
          .level-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .level-card:hover::before {
            left: 100%;
          }
          
          .level-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: rgba(59, 130, 246, 0.8);
            box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2);
          }
          
          .accent-bar {
            background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: scale(1);
            }
            to {
              opacity: 0;
              transform: scale(0.95);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(1.05);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            }
            50% {
              box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(6, 182, 212, 0.4);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideOutLeft {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(-100%);
            }
          }
          
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.5) translateY(-20px);
            }
            50% {
              transform: scale(1.1) translateY(0);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes popOut {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0.8) translateY(-20px);
            }
          }
          
          .animate-slide-up {
            animation: slideUp 0.6s ease-out forwards;
          }
          
          .page-transition-exit {
            animation: fadeOut 0.3s ease-out forwards;
          }
          
          .page-transition-enter {
            animation: fadeIn 0.3s ease-out forwards;
          }
          
          .pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
          
          .shimmer-effect {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 1000px 100%;
            animation: shimmer 3s infinite;
          }
          
          .stagger-1 { animation-delay: 0.1s; opacity: 0; }
          .stagger-2 { animation-delay: 0.2s; opacity: 0; }
          .stagger-3 { animation-delay: 0.3s; opacity: 0; }
          
          .glow-text {
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.4);
          }
          
          .neon-border {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), inset 0 0 15px rgba(59, 130, 246, 0.2);
          }
          
          .exercise-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
          }
          
          .exercise-card:hover {
            transform: translateX(5px);
            box-shadow: -5px 0 20px rgba(59, 130, 246, 0.3);
          }
          
          .icon-pulse {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          
          .modal-backdrop {
            animation: fadeIn 0.2s ease-out;
          }
          
          .modal-content {
            animation: slideUp 0.3s ease-out;
          }
          
          .points-notification {
            animation: popIn 0.3s ease-out;
          }
        `}</style>
        
        <div className="max-w-md mx-auto pt-12">
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-block p-4 bg-blue-600/20 rounded-full mb-4 pulse-glow">
              <Target className="w-12 h-12 text-blue-400 float-animation" />
            </div>
            <h1 className="goalie-title text-6xl mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent glow-text">
              NETMINDER
            </h1>
            <p className="text-blue-300 text-lg">Elite Goalie Training System</p>
            <div className="mt-4 inline-block px-4 py-2 bg-blue-600/10 rounded-full border border-blue-500/30 neon-border">
              <span className="text-sm text-blue-300">⚡ Personalized Programs • Real Results</span>
            </div>
          </div>

          <div className="mb-8 animate-slide-up stagger-1">
            <h2 className="text-2xl font-bold mb-2">Select Your Level</h2>
            <p className="text-slate-400 mb-6">Choose the program that matches your current abilities</p>
          </div>

          <div className="space-y-4">
            <div 
              onClick={() => handleOnboardingComplete('beginner')}
              className="level-card p-6 rounded-2xl cursor-pointer animate-slide-up stagger-1"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="goalie-title text-2xl text-blue-400 mb-1">ROOKIE</h3>
                  <p className="text-sm text-slate-300">New to position or returning from break</p>
                </div>
                <ChevronRight className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 bg-slate-800 rounded">4 weeks</span>
                <span className="px-2 py-1 bg-slate-800 rounded">Foundation</span>
              </div>
            </div>

            <div 
              onClick={() => handleOnboardingComplete('intermediate')}
              className="level-card p-6 rounded-2xl cursor-pointer animate-slide-up stagger-2"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="goalie-title text-2xl text-cyan-400 mb-1">STARTER</h3>
                  <p className="text-sm text-slate-300">Solid fundamentals, ready to level up</p>
                </div>
                <ChevronRight className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 bg-slate-800 rounded">6 weeks</span>
                <span className="px-2 py-1 bg-slate-800 rounded">Explosive Power</span>
              </div>
            </div>

            <div 
              onClick={() => handleOnboardingComplete('advanced')}
              className="level-card p-6 rounded-2xl cursor-pointer animate-slide-up stagger-3"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="goalie-title text-2xl text-emerald-400 mb-1">ELITE</h3>
                  <p className="text-sm text-slate-300">High-level competitor seeking peak performance</p>
                </div>
                <ChevronRight className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 bg-slate-800 rounded">8 weeks</span>
                <span className="px-2 py-1 bg-slate-800 rounded">Pro Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  if (currentView === 'dashboard') {
    const program = workoutPrograms[userProfile.level];
    
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 font-sans ${isTransitioning ? 'page-transition-exit' : 'page-transition-enter'}`}>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button 
              onClick={() => navigateTo('onboarding')}
              className="text-blue-400 mb-4 hover:text-blue-300 transition-colors flex items-center gap-2"
            >
              ← Change Level
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="goalie-title text-4xl mb-1">YOUR PROGRAM</h1>
              <p className="text-slate-400">Level: {userProfile.level.charAt(0).toUpperCase() + userProfile.level.slice(1)}</p>
            </div>
            <div className="p-3 bg-blue-600/20 rounded-full">
              <User className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          {/* Points and Streak */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 p-4 rounded-2xl border border-yellow-500/30">
              <div className="text-2xl mb-1">⭐</div>
              <div className="goalie-title text-2xl text-yellow-400">{userProfile.points}</div>
              <div className="text-xs text-slate-400">Points</div>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 p-4 rounded-2xl border border-orange-500/30">
              <div className="text-2xl mb-1">🔥</div>
              <div className="goalie-title text-2xl text-orange-400">{userProfile.streak}</div>
              <div className="text-xs text-slate-400">Day Streak</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 p-4 rounded-2xl border border-emerald-500/30">
              <div className="text-2xl mb-1">✓</div>
              <div className="goalie-title text-2xl text-emerald-400">{userProfile.totalWorkouts}</div>
              <div className="text-xs text-slate-400">Workouts</div>
            </div>
          </div>

          {/* Today's Progress (if workout in progress) */}
          {activeWorkout && activeWorkoutLevel === userProfile.level && !isWorkoutComplete() && (
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-2xl mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Today's Progress</h3>
                <span className="text-xs text-slate-400">
                  {Object.values(exerciseSets).reduce((sum, sets) => sum + sets, 0)}/
                  {activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0)} sets
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="accent-bar h-full transition-all duration-500"
                  style={{ 
                    width: `${(Object.values(exerciseSets).reduce((sum, sets) => sum + sets, 0) / 
                            activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0)) * 100}%` 
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">Keep it up! Resume your workout below.</p>
            </div>
          )}

          {/* Level Changed Notice */}
          {activeWorkout && activeWorkoutLevel && activeWorkoutLevel !== userProfile.level && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-2xl mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-bold text-yellow-400">Level Changed</h3>
              </div>
              <p className="text-sm text-slate-300">
                You changed from <span className="font-bold">{activeWorkoutLevel}</span> to <span className="font-bold">{userProfile.level}</span>. 
                Starting a new workout will begin fresh at your new level.
              </p>
            </div>
          )}

          {/* Workout Complete Message */}
          {activeWorkout && activeWorkoutLevel === userProfile.level && isWorkoutComplete() && (
            <div className="bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 border-2 border-emerald-500/50 p-5 rounded-2xl mb-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="font-bold text-xl mb-1 text-emerald-400">Workout Complete!</h3>
              <p className="text-sm text-slate-300">Great job today! Come back tomorrow for more gains.</p>
            </div>
          )}

          {/* Program Card */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-3xl mb-6 shadow-2xl pulse-glow relative overflow-hidden">
            <div className="shimmer-effect absolute inset-0 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="goalie-title text-3xl mb-2">{program.title}</h2>
                  <p className="text-blue-100">{program.focus}</p>
                </div>
                <Target className="w-8 h-8 text-white/80 float-animation" />
              </div>
              
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <span className="text-sm text-blue-100">{program.weeks} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-blue-200" />
                  <span className="text-sm text-blue-100">{program.exercises.length} exercises</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!isWorkoutComplete() || activeWorkoutLevel !== userProfile.level) {
                    startWorkout(program);
                  }
                }}
                disabled={isWorkoutComplete() && activeWorkoutLevel === userProfile.level}
                className={`w-full mt-6 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  isWorkoutComplete() && activeWorkoutLevel === userProfile.level
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105'
                }`}
              >
                <Play className="w-5 h-5" />
                {activeWorkout && activeWorkoutLevel === userProfile.level && !isWorkoutComplete() 
                  ? 'RESUME WORKOUT' 
                  : activeWorkoutLevel && activeWorkoutLevel !== userProfile.level
                  ? 'START NEW LEVEL WORKOUT'
                  : isWorkoutComplete() && activeWorkoutLevel === userProfile.level
                  ? 'COMPLETE - SEE YOU TOMORROW!' 
                  : 'START TODAY\'S WORKOUT'}
              </button>
            </div>
          </div>

          {/* Exercise Preview */}
          <div>
            <h3 className="text-lg font-bold mb-4">Today's Exercises</h3>
            <div className="space-y-3">
              {program.exercises.slice(0, 3).map((exercise, idx) => (
                <div key={exercise.id} className="exercise-card bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/50">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{exercise.image}</div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{exercise.name}</div>
                      <div className="text-sm text-slate-400 mb-2">{exercise.duration}</div>
                      <div className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full inline-block">
                        {exercise.target}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {program.exercises.length > 3 && (
                <div className="text-center text-sm text-slate-500 py-2">
                  +{program.exercises.length - 3} more exercises
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Email Setup Alert */}
        {showEmailAlert && !userProfile.email && (
          <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto modal-backdrop">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-5 rounded-2xl shadow-2xl border-2 border-blue-400 modal-content">
              <div className="flex items-start gap-3">
                <div className="text-3xl">📧</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Get Your Progress Reports!</h3>
                  <p className="text-sm text-blue-100 mb-3">
                    Enter your email to receive detailed workout reports with your stats, points, and streak info.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 text-sm focus:outline-none focus:border-white"
                    />
                    <button
                      onClick={() => {
                        if (emailInput) {
                          setUserProfile({ ...userProfile, email: emailInput });
                          setShowEmailAlert(false);
                        }
                      }}
                      disabled={!emailInput}
                      className="px-4 py-2 bg-white text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailAlert(false)}
                  className="text-white/80 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Workout View
  if (currentView === 'workout' && activeWorkout) {
    const progress = (completedExercises.length / activeWorkout.exercises.length) * 100;
    
    // Detailed Exercise View
    if (selectedExercise) {
      const completedSets = exerciseSets[selectedExercise.id] || 0;
      const allSetsComplete = completedSets >= selectedExercise.sets;
      
      return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 font-sans ${isTransitioning ? 'page-transition-exit' : 'page-transition-enter'}`}>
          <div className="max-w-md mx-auto">
            {/* Header */}
            <button 
              onClick={() => {
                setSelectedExercise(null);
                stopTimer();
              }}
              className="text-blue-400 mb-6 hover:text-blue-300 transition-colors flex items-center gap-2"
            >
              ← Back to Workout
            </button>

            {/* Exercise Hero */}
            <div className="text-center mb-8 animate-slide-up">
              <div className="inline-block p-8 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-3xl mb-6 pulse-glow">
                <div className="text-8xl">{selectedExercise.image}</div>
              </div>
              <h1 className="goalie-title text-4xl mb-2 glow-text">{selectedExercise.name}</h1>
              <p className="text-xl text-blue-300 mb-4">{selectedExercise.sets} sets × {selectedExercise.duration}</p>
              <div className="flex justify-center gap-2">
                <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm border border-blue-500/30">
                  {selectedExercise.target}
                </span>
                <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm border border-slate-600">
                  {selectedExercise.difficulty}
                </span>
              </div>
            </div>

            {/* Set Progress */}
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 mb-4 neon-border animate-slide-up">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Set Progress</h3>
                <span className="text-2xl goalie-title text-blue-400">{completedSets}/{selectedExercise.sets}</span>
              </div>
              <div className="flex gap-2">
                {[...Array(selectedExercise.sets)].map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-3 rounded-full transition-all ${
                      index < completedSets
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              
              {/* Recommended Rest Time */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Recommended Rest:</span>
                  <span className="font-bold text-cyan-400">{selectedExercise.restTime}s between sets</span>
                </div>
              </div>
            </div>

            {/* Rest Timer (shows after completing a set) */}
            {restTimerActive && (
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-6 rounded-2xl border-2 border-purple-500/50 mb-4 neon-border animate-slide-up">
                <div className="text-center mb-4">
                  <div className="text-5xl goalie-title mb-2 text-purple-400 glow-text">
                    {formatTime(restTimeRemaining)}
                  </div>
                  <p className="text-purple-300 text-sm mb-1">⏱ Rest Time</p>
                  <p className="text-xs text-slate-400">Next exercise starts automatically</p>
                </div>
                
                <button
                  onClick={skipRest}
                  className="w-full py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-all"
                >
                  Skip Rest & Continue ⏭
                </button>
              </div>
            )}

            {/* Timer Section (if time-based) */}
            {selectedExercise.isTimeBased && !restTimerActive && (
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 rounded-2xl border-2 border-blue-500/50 mb-4 neon-border animate-slide-up stagger-1">
                <div className="text-center mb-4">
                  <div className={`text-6xl goalie-title mb-2 ${timerActive ? 'text-cyan-400 glow-text' : timeRemaining === 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {timeRemaining > 0 ? formatTime(timeRemaining) : formatTime(selectedExercise.timeInSeconds)}
                  </div>
                  <p className="text-slate-300 text-sm">
                    {timerActive ? '⏱ Timer Running...' : timeRemaining === 0 ? '✓ Set Complete!' : timeRemaining < selectedExercise.timeInSeconds ? '⏸ Paused' : 'Ready to Start'}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {timeRemaining === 0 && (
                    <button
                      onClick={() => startTimer(selectedExercise.timeInSeconds)}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold hover:from-blue-500 hover:to-cyan-500 transition-all pulse-glow"
                    >
                      ▶ Start Timer
                    </button>
                  )}
                  
                  {timerActive && (
                    <button
                      onClick={stopTimer}
                      className="flex-1 py-3 bg-yellow-600 rounded-xl font-bold hover:bg-yellow-500 transition-all"
                    >
                      ⏸ Pause
                    </button>
                  )}
                  
                  {timeRemaining > 0 && !timerActive && (
                    <>
                      <button
                        onClick={() => setTimerActive(true)}
                        className="flex-1 py-3 bg-emerald-600 rounded-xl font-bold hover:bg-emerald-500 transition-all pulse-glow"
                      >
                        ▶ Resume
                      </button>
                      <button
                        onClick={() => resetTimer(selectedExercise.timeInSeconds)}
                        className="flex-1 py-3 bg-slate-700 rounded-xl font-bold hover:bg-slate-600 transition-all"
                      >
                        🔄 Reset
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* How To Do It */}
            {!restTimerActive && (
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 mb-4 neon-border animate-slide-up stagger-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </div>
                  <h3 className="text-lg font-bold">How To Do It</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">{selectedExercise.description}</p>
              </div>
            )}

            {/* Pro Tips */}
            {!restTimerActive && (
              <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-6 rounded-2xl border border-yellow-600/30 mb-6 animate-slide-up stagger-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-100" />
                  </div>
                  <h3 className="text-lg font-bold text-yellow-300">Pro Tips</h3>
                </div>
                <p className="text-yellow-100 leading-relaxed">{selectedExercise.tips}</p>
              </div>
            )}

            {/* Action Buttons */}
            {!restTimerActive && (
              <div className="space-y-3 animate-slide-up stagger-3">
              {!allSetsComplete ? (
                <>
                  {/* Manual complete button - only show if not time-based or if timer isn't being used */}
                  {(!selectedExercise.isTimeBased || (selectedExercise.isTimeBased && timeRemaining === 0)) && (
                    <button
                      onClick={() => {
                        completeSet(selectedExercise.id, selectedExercise.sets, selectedExercise);
                        if (selectedExercise.isTimeBased) {
                          resetTimer(selectedExercise.timeInSeconds);
                        }
                      }}
                      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 pulse-glow"
                    >
                      <Check className="w-5 h-5" />
                      {selectedExercise.isTimeBased && timeRemaining === 0 ? 'Next Set' : `Complete Set ${completedSets + 1}/${selectedExercise.sets}`}
                    </button>
                  )}
                  
                  {/* Show info if timer is running or paused */}
                  {selectedExercise.isTimeBased && timeRemaining > 0 && (
                    <div className="text-center text-sm text-slate-400 py-2">
                      {timerActive ? 'Set will auto-complete when timer finishes' : 'Resume or reset timer to continue'}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setSelectedExercise(null);
                    stopTimer();
                  }}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-emerald-500 to-cyan-500 cursor-default"
                >
                  <Check className="w-5 h-5" />
                  All Sets Complete! ✓
                </button>
              )}
              
              <button
                onClick={() => {
                  setSelectedExercise(null);
                  stopTimer();
                }}
                className="w-full py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Back to Workout
              </button>
            </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 font-sans ${isTransitioning ? 'page-transition-exit' : 'page-transition-enter'}`}>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button 
              onClick={() => {
                navigateTo('dashboard');
                stopTimer();
              }}
              className="text-blue-400 mb-4 hover:text-blue-300 transition-colors"
            >
              ← Back to Dashboard
            </button>
            
            <h1 className="goalie-title text-3xl mb-2">{activeWorkout.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{completedExercises.length} / {activeWorkout.exercises.length} completed</span>
              <span>•</span>
              <span>{Math.round(progress)}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full mt-3 overflow-hidden neon-border">
              <div 
                className="accent-bar h-full transition-all duration-500 shimmer-effect"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-4">
            {activeWorkout.exercises.map((exercise) => {
              const completedSets = exerciseSets[exercise.id] || 0;
              const allSetsComplete = completedSets >= exercise.sets;
              
              return (
                <div 
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`exercise-card p-5 rounded-2xl border-2 cursor-pointer ${
                    allSetsComplete 
                      ? 'bg-emerald-900/20 border-emerald-500/50' 
                      : 'bg-slate-800/30 border-slate-700 hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{exercise.image}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{exercise.name}</h3>
                        <p className="text-slate-400 text-sm mb-2">{exercise.sets} sets × {exercise.duration}</p>
                        
                        {/* Set Progress Indicator */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {[...Array(exercise.sets)].map((_, index) => (
                              <div
                                key={index}
                                className={`w-6 h-1.5 rounded-full ${
                                  index < completedSets ? 'bg-emerald-500' : 'bg-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-400">
                            {completedSets}/{exercise.sets} sets
                          </span>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">
                            {exercise.target}
                          </span>
                          {exercise.isTimeBased && (
                            <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full">
                              ⏱ Timed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        allSetsComplete
                          ? 'bg-emerald-500'
                          : completedSets > 0
                          ? 'bg-yellow-600'
                          : 'bg-blue-600 icon-pulse'
                      }`}
                    >
                      {allSetsComplete ? (
                        <Check className="w-6 h-6" />
                      ) : completedSets > 0 ? (
                        <span className="text-sm font-bold">{completedSets}</span>
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 mt-2">
                    {allSetsComplete ? '✓ Complete!' : 'Tap for details and timer →'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complete Workout Button */}
          {completedExercises.length === activeWorkout.exercises.length && (
            <div className="space-y-3">
              <button 
                onClick={() => navigateTo('dashboard')}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-4 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all pulse-glow"
              >
                🎉 WORKOUT COMPLETE! Return to Dashboard
              </button>
              
              <button 
                onClick={() => setShowEmailModal(true)}
                className="w-full bg-blue-600/30 text-blue-300 font-bold py-3 rounded-xl border border-blue-500/50 hover:bg-blue-600/50 transition-all"
              >
                📧 Email Progress Report
              </button>
            </div>
          )}
          
          {/* Incomplete workout - show email option */}
          {completedExercises.length > 0 && completedExercises.length < activeWorkout.exercises.length && (
            <button 
              onClick={() => setShowEmailModal(true)}
              className="w-full mt-6 bg-slate-800/50 text-slate-300 font-bold py-3 rounded-xl border border-slate-600 hover:bg-slate-700/50 transition-all"
            >
              📧 Email Progress So Far
            </button>
          )}
        </div>
        
        {/* Points Notification */}
        {showPointsNotification && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 points-notification">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 pulse-glow">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-lg">+{pointsEarned} Points!</span>
            </div>
          </div>
        )}
        
        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 modal-backdrop" onClick={() => setShowEmailModal(false)}>
            <div className="bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-6 max-w-md w-full modal-content" onClick={(e) => e.stopPropagation()}>
              {!emailSent ? (
                <>
                  <h2 className="goalie-title text-3xl mb-2 text-center">Send Progress Report</h2>
                  <p className="text-slate-400 text-center mb-6">Get your workout stats delivered to your inbox</p>
                  
                  <div className="bg-slate-800/50 p-4 rounded-xl mb-4 border border-slate-700">
                    <div className="text-sm text-slate-400 mb-3">Your Progress:</div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-yellow-600/10 p-3 rounded-lg border border-yellow-600/30">
                        <div className="text-xs text-slate-400 mb-1">Total Points</div>
                        <div className="text-xl goalie-title text-yellow-400">{userProfile.points}</div>
                      </div>
                      <div className="bg-orange-600/10 p-3 rounded-lg border border-orange-600/30">
                        <div className="text-xs text-slate-400 mb-1">Streak</div>
                        <div className="text-xl goalie-title text-orange-400">{userProfile.streak} days</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span>Completed Exercises:</span>
                      <span className="font-bold text-blue-400">{completedExercises.length}/{activeWorkout.exercises.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Sets Done:</span>
                      <span className="font-bold text-cyan-400">
                        {Object.values(exerciseSets).reduce((sum, sets) => sum + sets, 0)}/
                        {activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0)}
                      </span>
                    </div>
                  </div>
                  
                  <input
                    type="email"
                    placeholder={userProfile.email || "your.email@example.com"}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 mb-4 focus:outline-none focus:border-blue-500"
                  />
                  
                  <div className="flex gap-3">
                    <button
                      onClick={sendProgressEmail}
                      disabled={!emailInput}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Send Report
                    </button>
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="px-6 py-3 bg-slate-700 rounded-xl font-bold hover:bg-slate-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✓</div>
                  <h3 className="goalie-title text-2xl mb-2">Report Sent!</h3>
                  <p className="text-slate-400">Check your inbox at {emailInput}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
