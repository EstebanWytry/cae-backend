import { vi } from 'vitest';
import { JwtService } from '@nestjs/jwt';
import type { UsersService } from '../users/users.service.js';
import { hashPassword } from '../../common/password.js';
import { AuthService } from './auth.service.js';

describe('AuthService.login', () => {
  const jwtService = new JwtService({ secret: 'secreto-de-prueba' });

  async function crearServicio() {
    const user = {
      id: 7,
      email: 'admin@ejemplo.com',
      password_hash: await hashPassword('clave-correcta'),
      role: 'admin',
    };
    const findByEmail = vi.fn(async (email: string) =>
      email === user.email ? user : null,
    );
    const usersService = { findByEmail } as unknown as UsersService;

    return { service: new AuthService(usersService, jwtService), findByEmail };
  }

  it('devuelve un token con el id y el rol cuando los datos son correctos', async () => {
    const { service } = await crearServicio();

    const result = await service.login({
      email: 'admin@ejemplo.com',
      password: 'clave-correcta',
    });

    const payload = await jwtService.verifyAsync(result.access_token);
    expect(payload.id).toBe(7);
    expect(payload.role).toBe('admin');
    expect(result).toMatchObject({ id: 7, email: 'admin@ejemplo.com', role: 'admin' });
  });

  it('no devuelve el hash de la contraseña', async () => {
    const { service } = await crearServicio();

    const result = await service.login({
      email: 'admin@ejemplo.com',
      password: 'clave-correcta',
    });

    expect(result).not.toHaveProperty('password_hash');
  });

  it('busca el email sin espacios y en minúsculas', async () => {
    const { service, findByEmail } = await crearServicio();

    await service.login({
      email: '  Admin@Ejemplo.COM ',
      password: 'clave-correcta',
    });

    expect(findByEmail).toHaveBeenCalledWith('admin@ejemplo.com');
  });

  it('rechaza una contraseña incorrecta', async () => {
    const { service } = await crearServicio();

    await expect(
      service.login({ email: 'admin@ejemplo.com', password: 'otra-clave' }),
    ).rejects.toThrow('Email o contraseña incorrectos');
  });

  it('rechaza un email que no existe con el mismo mensaje', async () => {
    const { service } = await crearServicio();

    await expect(
      service.login({ email: 'nadie@ejemplo.com', password: 'clave-correcta' }),
    ).rejects.toThrow('Email o contraseña incorrectos');
  });
});