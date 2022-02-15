import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from 'fs';

const make_new_chrome_profile = (profile_id: string) => {
    const user_data_dir = `/home/drg101/Personal/specter/temp/${profile_id}`
    console.log(`New user data dir ${user_data_dir}`)
    fs.mkdirSync(user_data_dir)
    return user_data_dir;
}

export default make_new_chrome_profile;