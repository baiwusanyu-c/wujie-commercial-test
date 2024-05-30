import request from '@/utils/request'
import type { CancelToken } from 'axios'
import type { CUpload } from './interface'

/**
 * 模板下载返回URL
 * @param {CUpload.templateName} templateName 模板名称
 */
export function templateDownloadApi(templateName: CUpload.templateName) {
  return request({
    url: `/oss/template/download/url/${templateName}`,
    method: 'get',
  })
}

/**
 * oss上传签名
 */
export function ossUploadSignApi() {
  return request<CUpload.OssRespData>({
    url: '/oss/aliyun/policy',
    method: 'get',
  })
}
/**
 * oss上传
 * @param {CUpload.OssUploadParams} data
 */
export function ossUploadApi(data: CUpload.OssUploadParams, cancelToken?: CancelToken) {
  return request({
    // url: import.meta.env.VITE_APP_OSS_API,
    url: '/oss/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    cancelToken,
  })
}
