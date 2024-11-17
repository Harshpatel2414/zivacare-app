// notificationService.js
import { db } from './firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';

class NotificationService {
  constructor() {
    this.usersCollection = collection(db, 'Users');
  }

  async addNotification(userId, notification) {
    try {
      const notificationsCollectionRef = collection(this.usersCollection, userId, 'notifications');
      const newNotificationDocRef = doc(notificationsCollectionRef);
      await setDoc(newNotificationDocRef, notification);
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  }

  async markAsRead(userId, notificationId) {
    try {
      const notificationDocRef = doc(this.usersCollection, userId, 'notifications', notificationId);
      await updateDoc(notificationDocRef, { markAsRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async deleteNotification(userId, notificationId) {
    try {
      const notificationDocRef = doc(this.usersCollection, userId, 'notifications', notificationId);
      await deleteDoc(notificationDocRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async deleteAllNotifications(userId) {
    try {
      const notificationsCollectionRef = collection(doc(this.usersCollection, userId), 'notifications');
      const snapshot = await getDocs(notificationsCollectionRef);
      const batch = db.batch();

      snapshot.docs.forEach(doc => batch.delete(doc.ref));

      await batch.commit();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      const notificationsCollectionRef = collection(db, "Users", userId, "notifications");
      const snapshot = await getDocs(notificationsCollectionRef);
      const batch = writeBatch(db);

      snapshot.docs.forEach((docSnapshot) => {
        const notification = docSnapshot.data();
        if (!notification.markAsRead) {
          batch.update(docSnapshot.ref, { markAsRead: true });
        }
      });

      await batch.commit();
      console.log('All notifications marked as read.');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async getNotifications(userId) {
  try {
    const notificationsCollectionRef = collection(doc(this.usersCollection, userId), 'notifications');
    const snapshot = await getDocs(notificationsCollectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
}
}

const notificationService = new NotificationService();

export default notificationService;
