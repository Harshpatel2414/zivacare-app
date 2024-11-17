import { db } from './firebase';
import { collection, addDoc, updateDoc, onSnapshot, query, where, doc, getDocs, getDoc } from 'firebase/firestore';

class AppointmentService {
  constructor() {
    this.appointmentsCollection = collection(db, 'appointments');
  }

  // Book an appointment by automatically generating an ID
  async bookAppointment(appointmentData) {
    try {
      await addDoc(this.appointmentsCollection, appointmentData);
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  }

  async cancelAppointment(appointmentId) {
    try {
      await updateDoc(doc(this.appointmentsCollection, appointmentId), { status: 'cancelled' });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  async scheduleAppointment(appointmentId, scheduleData) {
    try {
      await updateDoc(doc(this.appointmentsCollection, appointmentId), { ...scheduleData, status: 'scheduled' });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  }

    async getAppointment(appointmentId) {
    try {
      const appointmentDoc = await getDoc(doc(this.appointmentsCollection, appointmentId));
      if (appointmentDoc.exists()) {
        return {id: appointmentDoc.id, ...appointmentDoc.data()};
      } else {
        console.log('No such appointment!');
        return null;
      }
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw error;
    }
  }

  async getBookedSlotsByDate(date) {
    try {
      const q = query(this.appointmentsCollection, where('date', '==', date));
      const querySnapshot = await getDocs(q);
      const slots = [];
      querySnapshot.forEach((doc) => {
        slots.push(doc.data().time);
      });
      return slots;
    } catch (error) {
      console.error('Error getting booked slots:', error);
      throw error;
    }
  }
  // Listen to real-time updates for a user's appointments
  listenToAppointments(userId, callback) {
    try {
      const q = query(this.appointmentsCollection, where('userId', '==', userId));
      return onSnapshot(q, (snapshot) => {
        const appointments = {
          upcoming: [],
          completed: [],
          canceled: []
        };
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'completed') {
            appointments.completed.push({ id: doc.id, ...data });
          } else if (data.status === 'cancelled') {
            appointments.canceled.push({ id: doc.id, ...data });
          } else {
            appointments.upcoming.push({ id: doc.id, ...data });
          }
        });
        callback(appointments);
      });
    } catch (error) {
      console.error('Error listening to appointments:', error);
      throw error;
    }
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;
