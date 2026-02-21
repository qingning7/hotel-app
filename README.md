# 易宿酒店系统（Yisu Hotel System）

包含三部分：
- [小程序端](https://github.com/qingning7/Taro-based-Hotel-Reservation-Mini-Program)：Taro（React 语法）→ 微信小程序
- 商家管理端：React + Ant Design
- 服务端：Node.js + Express（本地 JSON 存储）

## 快速运行

> 操作系统：Windows（PowerShell）

1) 安装依赖
```powershell
# 服务端
cd d:\vscodeproject\yisuhotelsystem\server
npm install

# 商家端
cd d:\vscodeproject\yisuhotelsystem\admin-frontend
npm install

# 小程序端
cd d:\vscodeproject\yisuhotelsystem\hotel-app
npm install
```

2) 启动服务端
```powershell
cd d:\vscodeproject\yisuhotelsystem\server
npm start
# 默认地址：http://localhost:4000
```

3) 启动小程序端（编译到 dist）
   在启动小程序端之前，需要在d:\vscodeproject\yisuhotelsystem\hotel-app新建环境文件hotel-app.env,
   里面只输入一行代码：TARO_APP_TENCENT_MAP_KEY=YOUR_KEY（需到腾讯官网申请）
   这样才能启用腾讯定位服务
```powershell
cd d:\vscodeproject\yisuhotelsystem\hotel-app
npm run dev:weapp
# 打开“微信开发者工具”，选择“导入项目”，目录指向上述 dist
然后点预览可以手机扫码运行小程序
```

4) 启动商家管理端
```powershell
cd d:\vscodeproject\yisuhotelsystem\admin-frontend
npm start
# 浏览器打开控制台提示的本地地址
```
