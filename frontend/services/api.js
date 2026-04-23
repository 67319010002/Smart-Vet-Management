const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getAppointments = async () => {
  try {
    const res = await fetch(`${API_URL}/appointments`);
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const bookAppointment = async (data) => {
  const res = await fetch(`${API_URL}/appointments/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || 'Failed to book appointment');
  }
  return result;
};
