import React, { useEffect, useRef, useState } from "react"
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
import './main.scss'
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useStore } from "@/store"
import { observer } from "mobx-react-lite"
import { http } from '@/utils/http'

const { Option } = Select

const Publish = () => {
  const { channelStore } = useStore()
  const [ fileList, setFileList ] = useState([])

  const cacheImgList = useRef([]) // 暂存图片列表
  const onUploadChange = ({ fileList }) => {
    console.log(fileList)
    setFileList(fileList)
    cacheImgList.current = fileList
  }

  const [ imgCount, setImgCount ] = useState(1)
  const radioChange = (e) => {
    console.log(e.target.value)
    setImgCount(e.target.value)
    if (imgCount === 1) {
      const img = cacheImgList ? cacheImgList.current[0] : []
      setFileList([ img ])
    } else if (imgCount === 3) {
      setFileList(cacheImgList.current)
    }
  }
  const onFinish = async (values) => {
    console.log(values)
    const { title, content, channel_id, type } = values
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.response.data.url) // 返回所有图片url
      }
    }
    await http.post('/mp/articles?/draft=false', params)
  }
  const [ params ] = useSearchParams()
  const id = params.get('id')
  const formRef = useRef()
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      formRef.current.setFieldsValue({ ...res.data, type: res.data.cover.type })
      setFileList(res.data.cover.images.map(url => {
        return {
          url
        }
      }))
      cacheImgList.current = res.data.cover.images.map(url => {
        return {
          url
        }
      })
    }
    // 编辑状态 发送请求
    if (id) {
      loadDetail().then()
    }
  }, [ id ]) // 只运行一次 加[]
  return (
      <div className="publish">
        <Card
            title={
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <Link to="/home">首页</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{id ? '编辑':'发布'}</Breadcrumb.Item>
              </Breadcrumb>
            }
        >
          <Form
              ref={formRef}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ type: 1, content: 'this is content' }}
              onFinish={onFinish}
          >
            <Form.Item
                label="标题"
                name="title"
                rules={[ { required: true, message: '请输入文章标题' } ]}
            >
              <Input placeholder="请输入文章标题" style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
                label="频道"
                name="channel_id"
                rules={[ { required: true, message: '请选择文章频道' } ]}
            >
              <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                {channelStore.channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option> )}
                <Option value={0}>推荐</Option>
              </Select>
            </Form.Item>

            <Form.Item label="封面">
              <Form.Item name="type">
                <Radio.Group onChange={radioChange}>
                  <Radio value={1}>单图</Radio>
                  <Radio value={3}>三图</Radio>
                  <Radio value={0}>无图</Radio>
                </Radio.Group>
              </Form.Item>
              {imgCount > 0 && (
                  <Upload
                      name="image"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList
                      action="http://geek.itheima.net/v1_0/upload"
                      fileList={fileList}
                      onChange={onUploadChange}
                      multiple={imgCount > 1}
                      maxCount={imgCount}
                  >
                    <div style={{ marginTop: 8 }}>
                      <PlusOutlined />
                    </div>
                  </Upload>
              )}
            </Form.Item>
            <Form.Item
                label="内容"
                name="content"
                rules={[ { required: true, message: '请输入文章内容' } ]}
            >
              <ReactQuill theme={"snow"}></ReactQuill>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button size="large" type="primary" htmlType="submit">
                  {id? '编辑文章':'发布文章'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
  )
}

export default observer(Publish)
