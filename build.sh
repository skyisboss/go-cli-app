#!/bin/bash
# 构建脚本 流程，进入ui目录，执行pnpm build构建react，然后退出ui目录，再构建go项目

VERSION=$(git describe --tags --dirty --always)
COMMIT=$(git rev-parse HEAD)

# The -w turns off DWARF debugging information
# The -s turns off generation of the Go symbol table
# The -X adds a string value definition of the form importpath.name=value
# LDFLAGS='-ldflags="-w -s -X 'main.gitVersion=${VERSION}' -X 'main.gitCommit=${COMMIT}'"'
LDFLAGS=(-ldflags="-w -s -X 'main.gitVersion=${VERSION}' -X 'main.gitCommit=${COMMIT}'")

# 进入ui目录
cd ui && pnpm run build
# 退出ui目录
cd ..
# 构建Go项目
go build -o tgmanager "${LDFLAGS[@]}" main.go

echo "successful!"