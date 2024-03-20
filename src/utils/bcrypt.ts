import * as bcrypt from 'bcrypt';

export async function encodePassword (rawPassword: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    return hashedPassword;
}

