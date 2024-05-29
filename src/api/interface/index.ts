/** 分页响应参数 */
export type ResPage<T, N extends string = 'list'> = Record<N, T[]> & { totalNumber: number }

/** 分页请求参数 */
export interface ReqPage {
  pageNo: number
  pageSize: number
}

/** 用户 */
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username?: string
  }
  export interface ResUserListItem {
    id: string
    userName: string // 名称
    createUser: string // 创建人
    email: string // 邮箱
    gender: number // 性别
    createTime: string // 创建时间
    updateTime: string // 更新时间
    status: number // 状态
    failReason: string // 失败原因
  }
  export type ResUserList = ResPage<ResUserListItem>

  export interface ReqSaveParams {
    userName: string
    email: string
    status: string
  }
}

/** 工具 */
export namespace Tools {
  export namespace Upload {
    export interface ReqSaveParams {
      tableName: string
      classification: string
      tableNa: string
      dataSource: string
      tableType: string
      tableCode: string
    }
    export interface ReqUploadParams extends ReqPage {
      classification?: string // 分类名称
      tableName?: string // 表名称
      tableNa?: string // 表名
      tableType?: string // 表类型
    }
    export interface ResUploadListItem {
      id: string
      classification: string
      tableName: string
      tableNa: string
      tableType: number
      createTime: string
      updateTime: string
    }
    export type ResUploadList = ResPage<ResUploadListItem>
  
    export interface ResUploadFileListItem {
      id: string
      fileName: string
      fileVersion: string
      fileSize: string
      fileRow: number
      status: string
      operator: string
      createTime: string
      updateTime: string
    }
    export type ResUploadFileList = ResPage<ResUploadFileListItem>
  }
}