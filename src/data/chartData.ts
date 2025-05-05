
// Sample data for the charts

// Monthly data for churn rate trend
export const churnRateData = [
  { month: 'Jan', rate: 5.2 },
  { month: 'Feb', rate: 5.8 },
  { month: 'Mar', rate: 6.3 },
  { month: 'Apr', rate: 5.9 },
  { month: 'May', rate: 5.1 },
  { month: 'Jun', rate: 4.8 },
  { month: 'Jul', rate: 4.5 },
  { month: 'Aug', rate: 4.2 },
  { month: 'Sep', rate: 4.9 },
  { month: 'Oct', rate: 5.3 },
  { month: 'Nov', rate: 5.7 },
  { month: 'Dec', rate: 5.4 },
];

// Monthly data for customer satisfaction
export const satisfactionData = [
  { month: 'Jan', score: 7.6 },
  { month: 'Feb', score: 7.4 },
  { month: 'Mar', score: 7.3 },
  { month: 'Apr', score: 7.5 },
  { month: 'May', score: 7.8 },
  { month: 'Jun', score: 8.0 },
  { month: 'Jul', score: 8.1 },
  { month: 'Aug', score: 8.2 },
  { month: 'Sep', score: 8.0 },
  { month: 'Oct', score: 7.9 },
  { month: 'Nov', score: 7.7 },
  { month: 'Dec', score: 7.8 },
];

// Filter data by date range
export const filterDataByDateRange = (
  data: Array<{ month: string; [key: string]: any }>,
  startMonth: number,
  endMonth: number
) => {
  const monthToIndex: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  return data.filter(item => {
    const monthIndex = monthToIndex[item.month];
    return monthIndex >= startMonth && monthIndex <= endMonth;
  });
};
