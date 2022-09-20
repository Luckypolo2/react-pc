import React from "react"
import './main.scss'
import { Button, Card, Checkbox, Form, Input, message } from "antd"
import logo from '@/assets/logo.png'
import { useStore } from "@/store"
import { useNavigate } from "react-router-dom"
function Login() {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  async function onFinish(values) {
    console.log('Success:', values)
    try {
      await loginStore.getToken({ mobile: values.mobile, code: values.code })
      navigate('/', { replace: true })
      message.success('登录成功')
    } catch (e) {
      message.error(e.response?.data?.message || '登录失败')
    }
  }
  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo)
  }
  return(
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt=""/>
        <Form initialValues={{ remember: true }}
              validateTrigger={[ 'onBlur','onChange' ]}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed} >
          <Form.Item name={"mobile"} rules={[
            {
              required: true,
              message: '请输入手机号'
            },
            {
              pattern: /^1[3456789]\d{9}$/,
              message: '手机号格式不正确',
              validateTrigger: 'onBlur'
            }
          ]}>
            <Input size="large" placeholder="请输入手机号"></Input>
          </Form.Item>
          <Form.Item name={"code"} rules={[
            {
              required: true,
              message: '请输入验证码'
            },
            {
              len: 6,
              message: '验证码长度为6位',
              validateTrigger: 'onBlur'
            }
          ]}>
            <Input size="large" placeholder="请输入验证码"></Input>
          </Form.Item>
          <Form.Item name={"remember"}
                     valuePropName={"checked"}>
            <Checkbox className="login-checkbox-label">
              我已阅读并同意用户协议和隐私条款
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type={"primary"}
                    htmlType={"submit"}
                    size={"large"}
                    block>登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
export default Login
