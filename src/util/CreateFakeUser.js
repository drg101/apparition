import Fakerator from "fakerator";
import { generate } from 'generate-password';

const fakerator = Fakerator();

const email_provider_to_extension = {
    outlook: "outlook.com"
}

const create_fake_user = (gender='M', email_provider='outlook') => {
    const fake_user_base = fakerator.entity.user(gender);
    const birth_date = new Date(fake_user_base.dob);
    const username = `${fake_user_base.firstName}${fake_user_base.lastName}${Math.floor(Math.random() * 999999)}`.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

    const birth_year = birth_date.getUTCFullYear() > 2001 ? 1994 : birth_date.getUTCFullYear() 
    const fake_user = {
        first_name: fake_user_base.firstName,
        last_name: fake_user_base.lastName,
        birth_day: birth_date.getUTCDate(),
        birth_month:birth_date.getUTCMonth(),
        birth_year: birth_year,
        created: Date.now(),
        email_provider,
        gender: gender==='M',
        username,
        password: generate({ numbers: true, length: 15 }),
        email: `${username}@${email_provider_to_extension[email_provider]}`
    }

    return fake_user
}

export default create_fake_user;