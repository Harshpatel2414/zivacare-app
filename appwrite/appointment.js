import { Client, Databases, Storage, ID, Query } from "react-native-appwrite";
import { config } from "./appwrite";
import { BASE_URL } from '@env';

export class AppointmentService {
  client = new Client();
  database;
  storage;

  constructor() {
    this.client.setEndpoint(config.endpoint).setProject(config.projectId);
    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.baseUrl = BASE_URL;
  }


  // file upload service
  async uploadFile(file) {
    let asset = {
      name: file.fileName,
      type: file.mimeType,
      size: file.fileSize,
      uri: file.uri
    }
    try {
      let data = await this.storage.createFile(
        config.storageId,
        ID.unique(),
        asset
      )
      return data
    } catch (error) {
      console.log("Appwrite serive :: uploadFile :: error", error);
      return false
    }
  }

  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile(
        config.storageId,
        fileId
      )
      return true
    } catch (error) {
      console.log("Appwrite serive :: deleteFile :: error", error);
      return false
    }
  }

  getFilePreview(fileId) {
    return this.storage.getFilePreview(
      config.storageId,
      fileId
    )
  }
}
const appointmentService = new AppointmentService();

export default appointmentService;
