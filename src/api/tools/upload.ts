import request from '@/utils/request'
import type { Tools } from '../interface'

export const getUploadList = (data: Tools.Upload.ReqUploadParams) => {
  return request<Tools.Upload.ResUploadList>({
    url: '/upload/list',
    method: 'post',
    data,
  })
}

export const addUpload = (data: Tools.Upload.ReqSaveParams) => {
  return request({
    url: '/upload/add',
    method: 'post',
    data,
  })
}

export const editUpload = (data: Tools.Upload.ReqSaveParams) => {
  return request({
    url: '/upload/edit',
    method: 'post',
    data,
  })
}

export const uploadDelete = (data: { id: string }) => {
  return request({
    url: '/upload/delete',
    method: 'post',
    data,
  })
}

export const uploadFile = (data: Tools.Upload.UploadFile) => {
  return request({
    url: '/upload/file',
    method: 'post',
    data,
  })
}

export const uploadRecord = (data: { id: string, type: string }) => {
  return request<Tools.Upload.ResUploadFileList>({
    url: '/upload/record',
    method: 'post',
    data,
  })
}

export const uploadDataSource = () => {
  return request<{ label: string, value: string }[]>({
    url: '/upload/datasource',
    method: 'post',
  })
}

