import { Client, Account, ID, Databases, Query } from "react-native-appwrite";
import { config } from "./appwrite";
import { BASE_URL } from '@env';

export class AuthService {

  client = new Client();
  account;
  database;

  constructor() {
    this.client.setEndpoint(config.endpoint).setProject(config.projectId);
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
    this.baseUrl = BASE_URL;
  }

  async createUser(data) {
    console.log("data >>>", data)
    try {
      // Create user document in the 'users' collection
      const userDocument = await fetch(`${this.baseUrl}/auth"`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      return userDocument;
    } catch (error) {
      console.error("Error adding user to collection:", error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/?id=${userId}`);
      const userDocument = await response.json();
      return userDocument;
    } catch (error) {
      console.error("Error fetching user from collection:", error);
      throw error;
    }
  }

  async updateUser(userId, data) {
    try {
      // Retrieve the user document from the collection
      const documents = await fetch(`${this.baseUrl}/auth/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, data })
      });
      let updatedUser = await this.getUser(userId);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user in collection:", error);
      throw error;
    }
  }

  async mobileCreateAccount({ phone }) {
    try {
      const token = await this.account.createPhoneToken(
        ID.unique(),
        phone
      );
      return token;
    } catch (error) {
      console.log("Appwrite serive :: mobileCreateAccount :: error", error);

    }
  }

  async verifyOtp({ userId, otp }) {
    try {
      const session = await this.account.createSession(
        userId,
        otp
      );
      return session;
    } catch (error) {
      console.log("Appwrite serive :: verifyOtp :: error", error);
    }
  }
  async isNewUser(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/?id=${userId}`);
      if (!response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("Appwrite service :: isNewUser :: error", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      console.log("Appwrite serive :: getCurrentUser :: error", error);
    }
    return null;
  }

  async logout() {
    try {
      // Ensure that the user is authenticated before attempting to log out
      const user = await this.getCurrentUser();
      if (user) {
        await this.account.deleteSession('current');  // Only delete current session
        console.log("User logged out successfully.");
        return true
      } else {
        console.log("No user is currently logged in.");
      }
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService