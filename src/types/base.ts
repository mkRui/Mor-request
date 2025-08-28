/*
 * @Author: mkRui
 * @Date: 2021-09-06 21:42:28
 * @LastEditTime: 2024-08-28 Updated
 * @Description: 基础类型定义
 */
export { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * HTTP 状态码枚举
 */
export enum HttpStatusCode {
  SUCCESS = 0,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * 请求方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
/**
 * 基础请求响应类型命名空间
 */
export declare namespace BaseRequest {
  /**
   * 成功响应接口
   * @template T - 响应数据类型
   */
  export interface Success<T = any> {
    /** 响应状态码，0 表示成功 */
    code: HttpStatusCode.SUCCESS;
    /** 数据总数，用于分页 */
    count: number;
    /** 响应消息 */
    msg: string;
    /** 响应数据 */
    data: T;
  }

  /**
   * 错误响应接口
   * @template T - 错误数据类型
   */
  export interface Error<T = any> {
    /** 错误状态码 */
    code: Exclude<HttpStatusCode, HttpStatusCode.SUCCESS>;
    /** 数据总数 */
    count: number | null;
    /** 错误消息 */
    msg: string;
    /** 错误详细信息 */
    data: T | null;
  }

  /**
   * 统一响应类型，采用错误优先的元组格式
   * @template T - 成功时的数据类型
   * @template E - 错误时的数据类型
   */
  export type Response<T = any, E = any> = [Error<E>, null] | [null, T];

  /**
   * 分页请求参数接口
   */
  export interface PaginationParams {
    /** 页码，从1开始 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 排序字段 */
    sortBy?: string;
    /** 排序方式 */
    sortOrder?: 'asc' | 'desc';
  }

  /**
   * 分页响应数据接口
   * @template T - 列表项数据类型
   */
  export interface PaginationData<T = any> {
    /** 数据列表 */
    list: T[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 总页数 */
    totalPages: number;
    /** 是否有下一页 */
    hasNext: boolean;
    /** 是否有上一页 */
    hasPrev: boolean;
  }

  /**
   * 请求配置选项接口
   */
  export interface RequestOptions {
    /** 是否显示加载提示 */
    loading?: boolean;
    /** 是否显示错误提示 */
    showError?: boolean;
    /** 是否显示成功提示 */
    showSuccess?: boolean;
    /** 自定义错误处理 */
    errorHandler?: (error: Error) => void;
    /** 请求超时时间（毫秒） */
    timeout?: number;
    /** 是否重试 */
    retry?: boolean;
    /** 重试次数 */
    retryTimes?: number;
    /** 重试间隔（毫秒） */
    retryDelay?: number;
  }
}
