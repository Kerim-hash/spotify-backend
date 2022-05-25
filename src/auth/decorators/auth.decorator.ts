import { applyDecorators, UseGuards } from '@nestjs/common';
import { TypeRole } from '../auth.interface';
import { OnlyAdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { OnlySingerGuard } from '../guards/singer.guard';

export function Auth(role: TypeRole = 'user') {
  return applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : role === 'singer'
      ? UseGuards(JwtAuthGuard, OnlySingerGuard)
      : UseGuards(JwtAuthGuard)
  );
}
