# Supabase 配置

## 1. 创建数据表

在 Supabase Dashboard 的 SQL Editor 中执行 `supabase-schema.sql`。

## 2. 创建管理员账号

在 Authentication > Users 中创建管理员邮箱和密码。管理员页面使用这个账号登录。

## 3. 填写前端配置

编辑 `supabase-config.js`：

```js
window.SUPABASE_CONFIG = {
  url: 'https://你的项目.supabase.co',
  anonKey: '你的 anon public key'
};
```

使用 Project Settings > API 中的 Project URL 和 anon public key。不要填写 `service_role` key。

## 4. 部署到 GitHub Pages

提交并推送这些文件到 GitHub 仓库，在仓库 Settings > Pages 中选择分支和根目录。前台地址为：

`https://你的用户名.github.io/仓库名/`

管理员地址为：

`https://你的用户名.github.io/仓库名/admin.html`

GitHub Pages 不运行 `server.js`。配置 Supabase 后，预约会直接写入 `test_drive_history` 表，管理员登录后可查看记录。
