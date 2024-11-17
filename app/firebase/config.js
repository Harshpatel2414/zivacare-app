import { Firebase_apiKey, Firebase_authDomain, Firebase_databaseURL, Firebase_projectId, Firebase_storageBucket, Firebase_messagingSenderId, Firebase_appId } from '@env';

const firebaseConfig = {
    apiKey: Firebase_apiKey,
    authDomain: Firebase_authDomain,
    databaseURL: Firebase_databaseURL,
    projectId: Firebase_projectId,
    storageBucket: Firebase_storageBucket,
    messagingSenderId: Firebase_messagingSenderId,
    appId: Firebase_appId
};

export default firebaseConfig;