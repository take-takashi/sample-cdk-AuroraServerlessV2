FROM node:16 AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build
# for prisma
COPY ./prisma ./prisma
RUN npx prisma generate

# Use a common base image to reduce the cold start time
FROM amazon/aws-lambda-nodejs:16

# Install Lambda Web Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.5.0 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=3000

COPY --from=builder /build/next.config.js ./
COPY --from=builder /build/public ./public
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/.next/standalone ./
# env copy (for prisma)
COPY --from=builder /build/.env.production ./.env
# for prisma
# prisma generateの後に以下の.prisma, @prismaディレクトリをコピーすると動いた
COPY --from=builder /build/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /build/node_modules/@prisma ./node_modules/@prisma

# Changes due to the base image
ENTRYPOINT ["node"]
CMD ["server.js"]