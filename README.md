# Taro-based-Hotel-Reservation-Mini-Program
这是一个基于 [Taro](https://taro.jd.com/) 框架开发的前端微信小程序项目，包含酒店查询页面、酒店列表页面、酒店详情页面。
## 🚀 快速上手

请按照以下步骤在本地运行项目：

### 1. 克隆代码
使用 Git 将项目下载到本地：
```bash
git clone https://github.com/qingning7/Taro-based-Hotel-Reservation-Mini-Program.git 文件夹名
cd 文件夹名
```

### 2. 安装依赖
由于源代码不包含 node_modules，在使用前必须安装依赖（建议使用 Node.js 16+）：
```bash
npm install
# 或者使用 yarn
# yarn install
```

### 3. 编译项目
运行编译命令，将 Taro 源代码转换为微信小程序可识别的代码：

开发模式 (推荐)：具备热更新功能，修改代码后工具会自动重新编译。
```bash
npm run dev:weapp
```

生产模式：用于最终发布前的打包压缩。
```bash
npm run build:weapp
```

### 4. 导入微信开发者工具

1. 打开微信开发者工具。

2. 点击 “导入” 按钮。

3. 关键步骤：目录请选择项目根目录下的 dist 文件夹（该文件夹在执行完第3步编译命令后会自动生成）。

- AppID 说明：请在开发者工具的“详情” -> “基本信息”中，将 AppID 修改为 “测试号”。
