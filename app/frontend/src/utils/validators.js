// Checks if a string is a valid date in mm/dd/yyyy format
export function isValidMMDDYYYY(dateStr) {
    // Regex for mm/dd/yyyy
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    // Further check for valid date (e.g., not 02/30/2020)
    const [month, day, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }