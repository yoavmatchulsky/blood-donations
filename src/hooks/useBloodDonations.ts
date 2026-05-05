import { useState, useEffect } from "react";

export const useBloodDonations = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBloodDonations = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestPayload = {
        RequestHeader: {
          Application: 101,
          Module: "BloodBank",
          Function: "GetAllDetailsDonations",
          Token: ""
        },
        RequestData: ""
      };

      const response = await fetch('/api/blood-donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result?.success) {
        const donations = result.data;
        console.log(donations);
        setData(donations);
      } else {
        setData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching blood donations');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    if (!loading && !data) {
      fetchBloodDonations();
    }
  }, []);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchBloodDonations 
  };
};
