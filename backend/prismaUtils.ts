import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient;
export const getPrismaClient = () => {
  if (prismaClient) {
    return prismaClient;
  } else {
    prismaClient = new PrismaClient();
    return prismaClient;
  }
};
