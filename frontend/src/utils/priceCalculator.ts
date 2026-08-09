export const calculateTotalPrice = (pricePerDay: number, startDate: Date | string, endDate: Date | string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate the difference in time
  const diffTime = Math.abs(end.getTime() - start.getTime());
  
  // Convert time difference to days (add 1 because booking is inclusive of start and end dates)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
  
  return pricePerDay * diffDays;
};
