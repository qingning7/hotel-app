# 易宿酒店系统（Yisu Hotel System）

## 🏗 项目架构

本仓库包含以下三个核心模块：
- [小程序端](https://github.com/qingning7/Taro-based-Hotel-Reservation-Mini-Program)：Taro（React 语法）→ 微信小程序
- 商家管理端：React + Ant Design
- 服务端：Node.js + Express（本地 JSON 存储）

```Plaintext
.
├── server/             # Express 服务端 (端口: 4000)
├── admin-frontend/     # React 商家后台 (端口: 3000)
└── hotel-app/          # Taro 小程序源码
    ├── src/            # 源代码
    ├── .env            # 环境变量配置 (需手动创建)
    └── dist/           # 编译后的产物 (微信工具导入此目录)
```

## 🛠 环境准备

在开始之前，请确保你的开发环境已安装以下工具：

Node.js: 建议版本 16.x 或以上

包管理工具: npm (随 Node.js 安装)

微信开发者工具: 用于预览和调试小程序

## 🚀 快速运行指南

### 1.克隆项目

首先，将代码克隆到本地任意文件夹（例如你的工作目录）：

```PowerShell
git clone https://github.com/qingning7/hotel-app.git
cd yisuhotelsystem
```
### 2.体验服务端 (Backend)

进入服务端目录：

```PowerShell
cd server
```
安装依赖并启动：

```PowerShell
npm install
npm start
```
接口地址：http://localhost:4000

### 3.体验商家管理端 (Admin)

打开新的终端窗口，进入管理端目录：

```PowerShell
cd admin-frontend
```
安装依赖并启动：

```PowerShell
npm install
npm start
```
访问地址：浏览器自动打开 http://localhost:3000 (或控制台输出的地址)。

### 4.体验小程序端 (Mini Program)

小程序端依赖腾讯地图 SDK 进行定位。

配置地图 Key：
在 hotel-app 根目录下创建环境文件 .env（如果已有则直接修改）：

```Plaintext
TARO_APP_TENCENT_MAP_KEY=你的腾讯地图Key
```
💡 提示：需前往 腾讯位置服务 申请 WebService 类型的 Key。

编译项目：
打开第三个终端窗口，进入小程序目录：

```PowerShell
cd hotel-app
npm install
npm run dev:weapp
```
微信运行：

启动 微信开发者工具。

点击 导入项目。

目录选择：定位到你克隆文件夹下的 hotel-app/dist 目录。

AppID 选择“测试号”或你自己的 AppID，确认导入。
