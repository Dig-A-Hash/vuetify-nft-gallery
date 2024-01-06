export const formatDate = (isoDate) => {
  try {
    // Attempt to create a valid Date object
    const dateObject = new Date(`${isoDate}T12:00:00.000Z`);

    // Check if the Date object is valid
    if (!isNaN(dateObject.getTime())) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return dateObject.toLocaleDateString('en-US', options);
    }
  } catch (error) {
    // If an error occurs during Date creation, return the original input
  }

  // If not a valid ISO date or an error occurred, return the original input
  return isoDate;
};
