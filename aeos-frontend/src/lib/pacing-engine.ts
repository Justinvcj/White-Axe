/**
 * Calculates the deterministic pacing schedule for a teacher.
 * Solves PS 37 by dividing remaining topics across available school days.
 */
export function calculatePacingSchedule(
  startDate: Date,
  endDate: Date,
  totalTopicsRemaining: number,
  holidays: Date[] = []
): { daysRemaining: number, topicsPerWeek: number, bufferDays: number } {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  
  let schoolDays = 0;
  let currentDate = new Date(startDate.getTime());

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Check if current date is a holiday
    const isHoliday = holidays.some(h => 
      h.getDate() === currentDate.getDate() &&
      h.getMonth() === currentDate.getMonth() &&
      h.getFullYear() === currentDate.getFullYear()
    );

    if (!isWeekend && !isHoliday) {
      schoolDays++;
    }
    
    currentDate.setTime(currentDate.getTime() + ONE_DAY);
  }

  // Assume 1 class per school day (simplification)
  const requiredClasses = totalTopicsRemaining; // 1 class per topic minimum
  
  if (schoolDays < requiredClasses) {
    return { daysRemaining: schoolDays, topicsPerWeek: Infinity, bufferDays: 0 };
  }

  const bufferDays = schoolDays - requiredClasses;
  
  // Calculate pace (e.g. how many topics need to be covered per 5-day week)
  const weeksRemaining = schoolDays / 5;
  const topicsPerWeek = totalTopicsRemaining / (weeksRemaining || 1);

  return {
    daysRemaining: schoolDays,
    topicsPerWeek: parseFloat(topicsPerWeek.toFixed(1)),
    bufferDays
  };
}
