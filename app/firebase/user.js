import { db } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

class UserService {
  constructor() {
    this.usersCollection = collection(db, 'Users');
  }

  async saveUser(userId, userData) {
    try {
      await setDoc(doc(this.usersCollection, userId), userData);
      await setDoc(doc(this.usersCollection, userId, 'notifications', 'initial'), {});
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async isNewUser(userId) {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, userId));
      return !userDoc.exists();
    } catch (error) {
      console.error('Error checking if user is new:', error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log('No such user!');
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async updateUser(userId, updatedData) {
    try {
      await updateDoc(doc(this.usersCollection, userId), updatedData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await deleteDoc(doc(this.usersCollection, userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

const userService = new UserService();

export default userService;
