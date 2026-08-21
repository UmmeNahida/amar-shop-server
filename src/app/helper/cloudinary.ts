import { v2 as cloudinary } from 'cloudinary';
import { envVars } from '../confic/env.js';

 cloudinary.config({ 
        cloud_name: envVars.CLOUD_NAME, 
        api_key: envVars.CLOUDE_API_KEY, 
        api_secret: envVars.CLOUDE_API_SECRET 
    });
export default cloudinary;