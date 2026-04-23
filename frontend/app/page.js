'use client';
import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';
import { getAppointments, bookAppointment } from '../services/api';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form State
  const [vetId, setVetId] = useState('1');
  const [petId, setPetId] = useState('1');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await getAppointments();
    setAppointments(data);
    setLoading(false);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!date || !time) {
      setError('Please select date and time');
      return;
    }

    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1); // 1 hour duration

    try {
      await bookAppointment({
        vetId: parseInt(vetId),
        petId: parseInt(petId),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        reason
      });
      setSuccess('Appointment booked successfully!');
      fetchAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Smart Vet Management</h1>
        <p className={styles.subtitle}>Manage appointments with No Double Booking guarantee</p>
      </header>

      <div className={styles.grid}>
        {/* Booking Form */}
        <section className={`${styles.card} ${styles.glass}`}>
          <h2>Book an Appointment</h2>
          <p style={{marginBottom: '1.5rem', color: '#94a3b8'}}>Select a vet and time to book an appointment.</p>
          
          {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
          {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

          <form onSubmit={handleBooking}>
            <div className={styles.formGroup}>
              <label>Veterinarian ID</label>
              <input type="number" value={vetId} onChange={(e) => setVetId(e.target.value)} min="1" required />
            </div>
            <div className={styles.formGroup}>
              <label>Pet ID</label>
              <input type="number" value={petId} onChange={(e) => setPetId(e.target.value)} min="1" required />
            </div>
            <div className={styles.formGroup}>
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Reason</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="3"></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
              Book Appointment
            </button>
          </form>
        </section>

        {/* Calendar View (Simple List for MVP) */}
        <section className={styles.card}>
          <h2>Upcoming Appointments</h2>
          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p style={{marginTop: '1rem', color: '#94a3b8'}}>No appointments scheduled.</p>
          ) : (
            <div className={styles.apptList}>
              {appointments.map(appt => (
                <div key={appt.id} className={styles.apptItem}>
                  <div style={{fontWeight: 600, color: 'var(--primary)'}}>
                    {new Date(appt.startTime).toLocaleString()}
                  </div>
                  <div style={{marginTop: '0.5rem'}}>
                    <strong>Vet ID:</strong> {appt.vetId} | <strong>Pet ID:</strong> {appt.petId}
                  </div>
                  {appt.reason && (
                    <div style={{marginTop: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem'}}>
                      Reason: {appt.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
