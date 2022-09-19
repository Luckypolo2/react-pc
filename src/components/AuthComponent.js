// 判断token是否存在 存在正常渲染 不存在跳转到登录页面
// 高阶组件 把组件包裹一层
import React from 'react'
import { getToken } from "@/utils"
import { Navigate } from "react-router-dom"

// eslint-disable-next-line react/prop-types
function AuthComponent({ children }) {
  const isToken = getToken()
  if (isToken) {
    return <>{children}</>
  } else {
    return <Navigate to="/login" replace />
  }
}

// <AuthComponent>  <Layout/> </AuthComponent>
// 登录: <> <Layout/> </>

export {
  AuthComponent
}
