import { v2 } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.constants';
import * as dotenv from 'dotenv';

dotenv.config();
export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: String(process.env.CLOUD_NAME),
      api_key: String(process.env.API_KEY),
      api_secret: String(process.env.API_SECRET),
    });
  },
};
