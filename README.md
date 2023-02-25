# sample-cdk-AuroraServerlessV2

CDK で AuroraServerlessV2 を立ててみる

# setup commands for cdk

```sh
mkdir cdk
cd cdk
cdk init --language typescript
```

# setup command for app

```sh
mkdir app
cd app
npx create-next-app@latest . --ts --eslint --experimental-app --src-dir --use-npm --import-alias "@/*"

```

さらに、`next.config.js`に`output: "standalone"`を追加

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: "standalone",
};

module.exports = nextConfig;
```

## add package

```sh
cd app
# install Tailwind CSS
# See https://tailwindcss.com/docs/guides/nextjs
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# install Tailwind UI
# See https://tailwindui.com/documentation
npm install @headlessui/react @heroicons/react
# Tailwind UIは不要だったかも

# install MUI5
npm install @mui/material @emotion/react @emotion/styled

# install prisma
npm install -D prisma
npx prisma init
```

### prisma setup

- .env ファイルに`DATABASE_URL`を記載
- `schema.prisma`ファイルを編集（テーブル構造の定義）
- `npx prisma migrate dev --name init`を実行（--name 以降は CommitMessage のようだ）
- `npx prisma generare`を実行

# codespaces secret

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_DEFAULT_REGION
- PRD_DATABASE_URL
- DEV_DATABASE_URL

  (See https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgres)

# memo

Isolated サブネットに踏み台 EC2 を作成しても SSM でアクセスできない。

どうやら VPC エンドポイントを設定しないといけないようだが、

タダじゃないのでやっぱり踏み台 EC2 は Public サブネットに配置した方が良いと思う。

その代わり、SSM でのみ接続するようにすれば SSH ポートとかは開けなくて良い。

# task

- ✅ S3 の構築
- ✅ 踏み台ホストのインスタンス ID をパラメータストアに保存したい
- ✅ AuroraServerlessV2 の構築
- ✅ S3 への VPN エンドポイントの作成
- cdk で lambda+API Gateway の作成
- API Gateway にドメイン適用
- ✅ Nextjs13 の UI 決定
- ✅ Tailwind UI 試してみたい
- ✅ Prisma 利用テスト
