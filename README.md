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

# codespaces secret

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_DEFAULT_REGION

# memo

Isolated サブネットに踏み台 EC2 を作成しても SSM でアクセスできない。

どうやら VPC エンドポイントを設定しないといけないようだが、

タダじゃないのでやっぱり踏み台 EC2 は Public サブネットに配置した方が良いと思う。

その代わり、SSM でのみ接続するようにすれば SSH ポートとかは開けなくて良い。

# タスク

- ✅ S3 の構築
- ✅ 踏み台ホストのインスタンス ID をパラメータストアに保存したい
- ✅ AuroraServerlessV2 の構築
- ✅ S3 への VPN エンドポイントの作成
