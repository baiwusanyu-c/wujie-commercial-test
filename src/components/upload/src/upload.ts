import { type UploadUserFile } from 'element-plus'
import type upload from './upload.vue'

export type UploadInstance = InstanceType<typeof upload>
/** 上传文件数据类型 */
export type UploadFile = UploadUserFile & { ossPath?: string }
