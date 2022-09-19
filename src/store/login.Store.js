import { makeAutoObservable } from "mobx"
import { http, setToken, getToken } from "@/utils"
class LoginStore {
  token= getToken() || '' // 刷新不消失
  constructor() {
    makeAutoObservable(this) //响应式
  }
  getToken = async ({ mobile, code }) => {
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile, code
    })
    console.log(res)
    this.token = res.data.data.token
    setToken(this.token)
  }
}

export default LoginStore
