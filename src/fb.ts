import { config } from './config/config';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/app';

export const fbapp = firebase.initializeApp(config);
export const store = firebase.firestore();
export const auth = firebase.auth();

store.settings({
    timestampsInSnapshots: true,
});
