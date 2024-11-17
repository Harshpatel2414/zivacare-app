import { db } from './firebase';
import { collection, doc, getDoc, getDocs, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';

class DoctorService {
  constructor() {
    this.doctorsCollection = collection(db, 'doctors');
  }
  getDoctors(callback) {
    try {
      const unsubscribe = onSnapshot(this.doctorsCollection, (querySnapshot) => {
        const doctors = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            imageUrl: data.imageUrl,
            specialization: data.specialization,
            rating: data.rating,
            review: data.reviews ? data.reviews.length : 0,
          };
        });
        callback(doctors);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error getting doctors:', error);
      throw error;
    }
  }

  async getDoctorById(doctorId) {
    try {
      const doctorDoc = await getDoc(doc(this.doctorsCollection, doctorId));
      if (doctorDoc.exists()) {
        return doctorDoc.data();
      } else {
        console.log('No such doctor!');
        return null;
      }
    } catch (error) {
      console.error('Error getting doctor:', error);
      throw error;
    }
  }

  async addReviewToDoctor(doctorId, review) {
    try {
      const doctorDocRef = doc(this.doctorsCollection, doctorId);
      const doctorDoc = await getDoc(doctorDocRef);

      if (!doctorDoc.exists()) {
        throw new Error('Doctor not found');
      }

      const doctorData = doctorDoc.data();
      const reviews = doctorData.reviews || [];
      reviews.push(review);

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await updateDoc(doctorDocRef, {
        reviews: arrayUnion(review),
        rating: averageRating,
      });

      return { ok: true };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
}

const doctorService = new DoctorService();
export default doctorService;
