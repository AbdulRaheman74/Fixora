import bcrypt from 'bcryptjs';

/**
 * Password Functions
 * Yeh file password hash aur verify karne ke liye hai
 * Password ko directly store nahi karte, hash karke store karte hain (security)
 */

// Password hash karne ke liye salt rounds (10 = secure aur fast balance)
const SALT_ROUNDS = 10;

/**
 * Function: Password Ko Hash Karo
 * Plain text password ko encrypted form mein convert karo
 */
export async function hashPassword(password: string): Promise<string> {
  // Step 1: Salt generate karo (random string for encryption)
  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  // Step 2: Password ko salt ke saath hash karo
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

/**
 * Function: Password Verify Karo
 * User ne jo password diya, wo database wale password se match karta hai ya nahi
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  // Password ko compare karo
  const isMatch = await bcrypt.compare(password, hash);

  return isMatch; // true ya false
}
