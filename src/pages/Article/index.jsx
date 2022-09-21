import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './main.scss'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { http } from '@/utils/http'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const [ channelList, setChannelList ] = useState([])
  const loadChannelList = async () => {
    const res = await http.get('/channels')
    setChannelList(res.data.data.channels)
  }
  useEffect(() => {
    loadChannelList().then()
  }, [])
  // 文章列表管理
  // eslint-disable-next-line no-unused-vars
  const [ list, setList ] = useState({
    list: [],
    count: 0
  })
  // 文章参数管理
  // eslint-disable-next-line no-unused-vars
  const [ params, setParams ] = useState({
    page: 1,
    per_page: 10
  })

  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/mp/articles', { params })
      console.log(res)
      setList({
        list: res.data.data.results,
        count: res.data.data.total_count
      })
    }
    loadList().then()
  }, [ params ])

  const onFinish = (values) => {
    const { channel_id, data, status } = values
    const _params = {}
    if (channel_id !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (data) {
      _params.begin_pubdate = data[0].format('YYYY-MM-DD')
      _params.end_pubdate = data[1].format('YYYY-MM-DD')
    }
    setParams({ ...params, ..._params })
  }
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width:120,
      render: cover => {
        return <img src={cover} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: () => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: () => {
        return (
            <Space size="middle">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
              <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
              />
            </Space>
        )
      }
    }
  ]
  const data = [
    {
      id: '8218',
      comment_count: 0,
      cover: {
        images:[ 'http://geek.itheima.net/resources/images/15.jpg' ],
      },
      like_count: 0,
      pubdate: '2019-03-11 09:00:00',
      read_count: 2,
      status: 2,
      title: 'wkwebview离线化加载h5资源解决方案'
    }
  ]
  return (
      <div>
        <div>123</div>
        <Card
            title={
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <Link to="/home">首页</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>内容管理</Breadcrumb.Item>
              </Breadcrumb>
            }
            style={{ marginBottom: 20 }}
        >
          <Form initialValues={{ status: -1 }} onFinish={onFinish}>
            <Form.Item label="状态" name="status">
              <Radio.Group>
                <Radio value={-1}>全部</Radio>
                <Radio value={0}>草稿</Radio>
                <Radio value={1}>待审核</Radio>
                <Radio value={2}>审核通过</Radio>
                <Radio value={3}>审核失败</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="频道" name="channel_id">
              <Select
                  placeholder="请选择文章频道"
                  style={{ width: 120 }}
              >
                {channelList.map(channels => <Option key={channels.id} value={channels.id}>{channels.name}</Option> )}
                {/*<Option value="lucy">Lucy</Option>*/}
              </Select>
            </Form.Item>

            <Form.Item label="日期" name="date">
              {/* 传入locale属性 控制中文显示*/}
              <RangePicker locale={locale}></RangePicker>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
                筛选
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title={`根据筛选条件共查询到 count 条结果：`}>
          <Table rowKey="id" columns={columns} dataSource={data} />
        </Card>
      </div>
  )
}

export default Article
