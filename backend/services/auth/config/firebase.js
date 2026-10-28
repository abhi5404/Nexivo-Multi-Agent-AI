
import {cert ,initializeApp} from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json.json' with { type: 'json' };

export const app = initializeApp({
  credential: cert(serviceAccount)
});
