import bcrypt from 'bcryptjs';

const users = [
  {
    id: 'user_ada',
    username: 'ada',
    name: 'Ada Lovelace',
    role: 'editor',
    passwordHash: bcrypt.hashSync('orbit-bridge-42', 10)
  },
  {
    id: 'user_grace',
    username: 'grace',
    name: 'Grace Hopper',
    role: 'viewer',
    passwordHash: bcrypt.hashSync('compiler-moon-7', 10)
  }
];

const publicUser = (user) => ({
  id: user.id,
  username: user.username,
  name: user.name,
  role: user.role
});

export async function authenticateUser(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string') {
    return null;
  }

  const normalizedUsername = username.trim().toLowerCase();
  const user = users.find((candidate) => candidate.username === normalizedUsername);

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return null;
  }

  return publicUser(user);
}

export function getUserById(userId) {
  const user = users.find((candidate) => candidate.id === userId);
  return user ? publicUser(user) : null;
}
