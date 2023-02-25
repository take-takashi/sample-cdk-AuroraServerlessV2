// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  // ユーザーの作成
  await prisma.user.create({
    data: {
      name: "foo",
      email: "test@test",
    },
  });

  // ユーザーの取得
  const users = await prisma.user.findMany();

  res.status(200).json(users);
}
