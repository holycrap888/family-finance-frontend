import { useState, useEffect, useCallback } from 'react';
import { summaryService } from '../services/summaryService.js';

export const useSummary = (month) => {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [summaryResult, chartResult] = await Promise.all([
        summaryService.getSummary(month),
        summaryService.getChartData(month)
      ]);
      
      if (summaryResult.success) {
        setSummary(summaryResult.data);
      } else {
        throw new Error(summaryResult.error);
      }
      
      if (chartResult.success) {
        // Convert chart data to proper format
        const formattedData = chartResult.data.map(item => ({
          day: parseInt(item.day),
          total: parseFloat(item.total)
        }));
        setChartData(formattedData);
      } else {
        console.warn('Chart data failed to load:', chartResult.error);
        setChartData([]);
      }
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    summary,
    chartData,
    loading,
    error,
    refresh: fetchData
  };
};
