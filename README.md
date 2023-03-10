# sample-cdk-AuroraServerlessV2

CDK で AuroraServerlessV2 を立ててみる

# Github Codespaces の注意点

- おそらく 2GB メモリだと足りないので 4GB で動かした方が良い

# setup commands for cdk

```sh
mkdir cdk
cd cdk
cdk init --language typescript
```

## DockerImageFunction のデプロイ準備

```sh
npm i @aws-cdk/aws-apigatewayv2-alpha@2.65.0-alpha.0
npm i @aws-cdk/aws-apigatewayv2-alpha@2.65.0-alpha.0
```

- この後、package.json のバージョンを固定にしておく（「^」->「」）

# setup command for app

```sh
mkdir app
cd app
npx create-next-app@latest . --ts --eslint --experimental-app --src-dir --use-npm --import-alias "@/*"

```

## Next.js standalone モードの設定

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

### AWS Lambda に DockerImageFunction としてデプロイするための準備

- `.dockerignore`ファイルを作成
- `Dockerfile`ファイルを作成
- ※この後に cdk 側で DockerImageFunction のデプロイ定義を書く必要がある

### Dockerfile の中に prisma を使う工夫が必要

- `npx prisma generate`

  ※ prisma ディレクトリの事前コピーが必要

- `prisma generate`後の`node_modules/.prisma`と`node_modules/@prisma`フォルダのコピー

  ※ Lambda 側で`prisma client`作成に必要のようだ

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
- `schame.prisma`ファイルに Lambda 用の記載も必要
  ```prisma
  # See https://zenn.dev/taroman_zenn/articles/da11f27537c37d
  generator client {
    provider = "prisma-client-js"
    binaryTargets = ["native", "rhel-openssl-1.0.x"]
  }
  ```

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
- ✅ cdk で lambda+API Gateway の作成
- API Gateway にドメイン適用
- ✅ Nextjs13 の UI 決定
- ✅ Tailwind UI 試してみたい
- ✅ Prisma 利用テスト
- npm script の整理（特に prima generate）
