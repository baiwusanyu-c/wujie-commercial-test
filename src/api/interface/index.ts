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
  }
  export type ResUserList = ResPage<ResUserListItem>
}
