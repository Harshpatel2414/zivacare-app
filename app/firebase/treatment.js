// app/firebase/TreatmentService.js

import { db } from './firebase';
import { collection, doc, getDoc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

class TreatmentService {
  constructor() {
    this.treatmentsCollection = collection(db, 'treatments');
  }
  async getTreatments() {
    try {
      const querySnapshot = await getDocs(this.treatmentsCollection);
      const treatments = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        treatments.push({ id: doc.id, name: data.name, icon: data.icon, imageUrl: data.imageUrl });
      });
      
      return treatments;
    } catch (error) {
      console.error('Error getting treatments:', error);
      throw error;
    }
  }

  async getTreatmentById(treatmentId) {
    try {
      const treatmentDoc = await getDoc(doc(this.treatmentsCollection, treatmentId));
      if (treatmentDoc.exists()) {
        return treatmentDoc.data();
      } else {
        console.log('No such treatment!');
        return null;
      }
    } catch (error) {
      console.error('Error getting treatment:', error);
      throw error;
    }
  }

  async addReviewToTreatment(treatmentId, review) {
    try {
      const treatmentDocRef = doc(this.treatmentsCollection, treatmentId);
      const treatmentDoc = await getDoc(treatmentDocRef);

      if (!treatmentDoc.exists()) {
        throw new Error('Treatment not found');
      }

      const treatmentData = treatmentDoc.data();
      const reviews = treatmentData.reviews || [];

      reviews.push(review);

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await updateDoc(treatmentDocRef, {
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

const treatmentService = new TreatmentService();
export default treatmentService;
