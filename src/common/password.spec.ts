import { hashPassword, comparePassword } from './password.js';

describe('password', () => {
  it('no guarda la contraseña en texto plano', async () => {
    const hash = await hashPassword('30123456');
    expect(hash).not.toBe('30123456');
  });

  it('genera un hash distinto cada vez para la misma contraseña', async () => {
    const hash1 = await hashPassword('30123456');
    const hash2 = await hashPassword('30123456');
    expect(hash1).not.toBe(hash2);
  });

  it('acepta la contraseña correcta', async () => {
    const hash = await hashPassword('30123456');
    expect(await comparePassword('30123456', hash)).toBe(true);
  });

  it('rechaza una contraseña incorrecta', async () => {
    const hash = await hashPassword('30123456');
    expect(await comparePassword('99999999', hash)).toBe(false);
  });
});