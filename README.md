# Mor-request

> 基于 Axios 的企业级 HTTP 请求库，提供类型安全的请求封装和统一的错误处理

[![npm version](https://badge.fury.io/js/mor-request.svg)](https://badge.fury.io/js/mor-request)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性

- 🔒 **类型安全**: 基于 TypeScript 开发，提供完整的类型定义
- 🚀 **开箱即用**: 简单的 API 设计，快速上手
- 🎯 **统一响应**: 所有请求返回统一的响应格式
- 🛡️ **错误处理**: 内置错误处理机制，支持自定义错误处理
- 📊 **事件系统**: 内置事件系统，方便状态管理
- 🔄 **拦截器**: 灵活的请求和响应拦截器配置
- 💾 **文件支持**: 内置文件上传和下载支持

## 安装

```bash
npm install mor-request
# 或
yarn add mor-request
# 或
pnpm add mor-request
```

## 快速开始

### 基本用法

```typescript
import { CreateAxios, Request } from 'mor-request';

// 创建 Axios 实例
const axiosInstance = CreateAxios({
  config: {
    baseURL: 'https://api.example.com',
    timeout: 10000,
  },
});

// 创建请求实例
const request = new Request(axiosInstance);

// 发送 GET 请求
const [error, data] = await request.get<User[]>('/users');

if (error) {
  console.error('请求失败:', error.msg);
} else {
  console.log('用户列表:', data);
}
```

### 高级配置

```typescript
import { CreateAxios, Request, CallbackType } from 'mor-request';

// 创建带拦截器的 Axios 实例
const axiosInstance = CreateAxios({
  config: {
    baseURL: 'https://api.example.com',
    timeout: 15000,
  },
  // 请求拦截器
  requestInterceptor: (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  // 响应拦截器
  responseInterceptor: ({ type, msg, code }) => {
    if (type === CallbackType.ERROR) {
      if (code === 401) {
        // 处理未授权情况
        window.location.href = '/login';
      } else {
        // 显示错误消息
        console.error(msg);
      }
    }
  },
});

const request = new Request(axiosInstance);
```

## API 文档

### CreateAxios(options)

创建一个 Axios 实例。

#### 参数

- `options.config`: Axios 配置对象
- `options.requestInterceptor`: 请求拦截器
- `options.responseInterceptor`: 响应拦截器
- `options.autoStringify`: 是否自动序列化请求参数（默认: true）

### Request 类

请求类，提供所有 HTTP 方法。

#### 方法

- `get<T>(url, params?, config?)`: GET 请求
- `post<T>(url, data?, config?)`: POST 请求
- `put<T>(url, data?, config?)`: PUT 请求
- `delete<T>(url, config?)`: DELETE 请求
- `patch<T>(url, data?, config?)`: PATCH 请求
- `head<T>(url, config?)`: HEAD 请求
- `options<T>(url, config?)`: OPTIONS 请求
- `upload<T>(url, file, config?)`: 文件上传
- `download(url, config?)`: 文件下载
- `request<T>(config)`: 通用请求方法

### 响应格式

所有请求都返回统一的响应格式：`[error, data]`

```typescript
interface Response<T, E = any> {
  [0]: Error<E> | null;  // 错误信息
  [1]: T | null;         // 成功数据
}

interface Error<T = any> {
  code: number;    // 错误状态码
  msg: string;     // 错误消息
  data: T | null;  // 错误详细信息
  count: number | null;
}
```

## 使用示例

### 1. 基本 CRUD 操作

```typescript
// 获取用户列表
const [error, users] = await request.get<User[]>('/users');

// 创建用户
const [createError, newUser] = await request.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// 更新用户
const [updateError, updatedUser] = await request.put<User>('/users/1', {
  name: 'Jane Doe',
});

// 删除用户
const [deleteError] = await request.delete('/users/1');
```

### 2. 文件上传

```typescript
// 上传单个文件
const fileInput = document.querySelector<HTMLInputElement>('#file-input');
const file = fileInput?.files?.[0];

if (file) {
  const [error, result] = await request.upload('/upload', file);
  if (!error) {
    console.log('上传成功:', result);
  }
}

// 上传多个文件
const formData = new FormData();
formData.append('avatar', avatarFile);
formData.append('document', documentFile);

const [error, result] = await request.upload('/upload-multiple', formData);
```

### 3. 文件下载

```typescript
const [error, blob] = await request.download('/files/document.pdf');

if (!error && blob) {
  // 创建下载链接
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
```

### 4. 事件监听

```typescript
import { EventDispatch } from 'mor-request';

// 监听请求开始
EventDispatch.on('request', (data) => {
  console.log('请求开始:', data);
  // 显示加载状态
  showLoading();
});

// 监听请求成功
EventDispatch.on('request:success', (data, url) => {
  console.log('请求成功:', url, data);
  hideLoading();
});

// 监听请求失败
EventDispatch.on('request:error', (error, url) => {
  console.error('请求失败:', url, error);
  hideLoading();
  showErrorMessage(error.msg);
});
```

### 5. 分页数据处理

```typescript
import { BaseRequest } from 'mor-request';

// 定义分页参数
const params: BaseRequest.PaginationParams = {
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// 获取分页数据
const [error, pageData] = await request.get<BaseRequest.PaginationData<User>>(
  '/users',
  params
);

if (!error && pageData) {
  console.log('用户列表:', pageData.list);
  console.log('总数:', pageData.total);
  console.log('当前页:', pageData.page);
  console.log('总页数:', pageData.totalPages);
}
```

### 6. Store 类使用

```typescript
import { Store } from 'mor-request';

class UserStore extends Store<Request> {
  async getUsers() {
    return this.api.get<User[]>('/users');
  }

  async getUserById(id: string) {
    return this.api.get<User>(`/users/${id}`);
  }

  async createUser(data: CreateUserDto) {
    return this.api.post<User>('/users', data);
  }
}

const userStore = new UserStore(request);
const [error, users] = await userStore.getUsers();
```

## 类型定义

该库提供了完整的 TypeScript 类型定义，包括：

- `BaseRequest.Response<T, E>`: 统一响应类型
- `BaseRequest.Success<T>`: 成功响应类型
- `BaseRequest.Error<T>`: 错误响应类型
- `BaseRequest.PaginationParams`: 分页参数类型
- `BaseRequest.PaginationData<T>`: 分页数据类型
- `BaseRequest.RequestOptions`: 请求配置选项
- `HttpMethod`: HTTP 方法类型
- `HttpStatusCode`: HTTP 状态码枚举

## 浏览器兼容性

- Chrome >= 63
- Firefox >= 57
- Safari >= 11
- Edge >= 79
- iOS Safari >= 11
- Android Browser >= 81

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的修改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 许可证

MIT License - 详情请查看 [LICENSE](LICENSE) 文件。

## 更新日志

详情请查看 [CHANGELOG.md](CHANGELOG.md)。