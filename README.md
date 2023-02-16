# sample-cdk-AuroraServerlessV2

CDK で AuroraServerlessV2 を立ててみる

# setup commands

```
mkdir cdk
cd cdk
cdk init --language typescript
```

# memo

Isolated サブネットに踏み台 EC2 を作成しても SSM でアクセスできない。

どうやら VPC エンドポイントを設定しないといけないようだが、

タダじゃないのでやっぱり踏み台 EC2 は Public サブネットに配置した方が良いと思う。

その代わり、SSM でのみ接続するようにすれば SSH ポートとかは開けなくて良い。
