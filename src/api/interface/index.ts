// * 分页请求参数
export interface ReqPage {
  pageNum: number
  pageSize: number
}
/** 用户 */
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string
    gender: number
    idCard: string
    email: string
    address: string
    createTime: string[]
    status: number
  }
  export interface ResUserList {
    id: string
    gender: number
    user?: {
      detail: {
        name: string
        age: number
      }
    }
    createTime: string
    updateTime: string
    status: '1' | '2' | '3'
    userNumber: number
  }

  export type ResCupShapeds = Array<{ label: string; value: any; color: string }>
}
