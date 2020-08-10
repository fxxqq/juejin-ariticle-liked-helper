import React from 'react'
import dayjs from 'dayjs'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import {
  Table,
  Button,
  Input,
  message,
  ConfigProvider,
  Alert,
  Modal,
} from 'antd'

import zhCN from 'antd/es/locale/zh_CN'
import { ColumnProps } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import './table.css'
import {
  Article,
  State,
  Props,
  filterDropdownType,
  MyWindow,
} from './interface'
// import VirtualTable from './virtualList'
let location: Location = window.location

const { Search } = Input
declare let window: MyWindow
let isLoadPlayer: boolean = false
class ArticleList extends React.Component<Props, State> {
  private box1Ref: React.RefObject<HTMLDivElement>
  private box2Ref: React.RefObject<HTMLDivElement>
  _isMounted = false
  state: State = {
    pagination: {
      position: ['bottomRight'],
      pageSize: 50,
    },
    likeList: [],
    searchText: '',
    searchedColumn: '',
    loading: true,
    scroll: undefined,
    isPc: false,
    visible: false,
  }
  searchInput: any
  constructor(props: Props) {
    super(props)
    this.box1Ref = React.createRef()
    this.box2Ref = React.createRef()
    this.searchInput = null
  }
  componentDidMount() {
    this.getLikeList()
    this.screenChange()
    return '0'
  }
  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('resize', this.resize)
  }

  screenChange() {
    window.addEventListener('resize', this.resize)
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    } else if (/(Android)/i.test(navigator.userAgent)) {
    } else {
      this.setState({
        isPc: true,
      })
    }
  }

  resize = () => {
    let scroll = window.innerHeight - 168
    const box1Ref = this.box1Ref.current
    const box2Ref = this.box2Ref.current
    if (!box1Ref) {
      scroll = scroll + 22
    }
    if (!box2Ref) {
      scroll = scroll + 32
    }

    this.setState({
      scroll,
    })
  }
  getLikeList = (value?: string) => {
    this._isMounted = true
    let { id } = this.props || ''
    if (value) {
      id = value
    }
    if (id) {
      if (id.length !== 16 || /[^\w]/.test(id)) {
        localStorage.removeItem('userid')
        this.props.history && this.props.history.push(`/`)
        return
      }
      localStorage.setItem('userid', id)
    } else {
      id = localStorage.getItem('userid') || '2330620383999822'
    }
    let base = 'https://juejin-api.58fe.com'
    if (location.port === '3000') {
      base = ''
    }

    axios
      .get(`${base}/api/getList/${id}`)
      .then((response) => {
        // console.log(response.data);
        if (this._isMounted) {
          this.setState({
            likeList: response.data,
            loading: false,
          })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  changeUser = (value: string) => {
    value = value.replace(/\s+/g, '')
    if (!value) {
      message.warning(
        '请复制您的掘金用户主页地址，例如：https://juejin.im/user/2330620383999822'
      )
      return
    }
    let userId = value.replace('https://juejin.im/user/', '')
    if (userId.length !== 16 || /[^\w]/.test(userId)) {
      message.warning('请检查你输入的掘金用户主页是否正确')
      return
    }

    if (userId) {
      this.setState(
        {
          loading: true,
        },
        () => {
          this.props.history && this.props.history.push(`/${userId}`)
          localStorage.setItem('userid', userId)
          this.getLikeList(userId)
        }
      )
    }
  }
  //模糊查找
  // fuzzySearch (selectedKeys: string, dataIndex: string) {
  //   console.log(selectedKeys, dataIndex, this.state.likeList)
  //   let { likeList } = this.state
  //   if (likeList.length) {
  //     likeList.map(item => {
  //     })
  //   }
  // }
  getColumnSearchProps = (dataIndex: string, type: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: filterDropdownType) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node
          }}
          placeholder={`根据关键字查找${type}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        {/* <Button
          type="primary"
          onClick={() => this.fuzzySearch(selectedKeys, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 50, marginRight: 8 }}
        >
          模糊查找
        </Button> */}
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          查找
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          清除
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? '#eb5424' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: Boolean) => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: (text: string, record: Article) =>
      this.state.searchedColumn === dataIndex ? (
        dataIndex === 'title' ? (
          <a
            href={record.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text.toString()}
            />
          </a>
        ) : (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        )
      ) : dataIndex === 'title' ? (
        <a href={record.originalUrl} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ) : (
        text
      ),
  })

  handleSearch = (
    selectedKeys: any,
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }
  handleReset = (clearFilters: any) => {
    clearFilters()
    this.setState({ searchText: '' })
  }
  // getArtcileContent = async (id: string) => {
  //   if (id) {
  //     axios.get(`api/getArtcileContent/${id}`).then(res => {
  //       console.log(res.data)
  //       this.setState({
  //         artcileContent: res.data
  //       })
  //     })
  //   }
  // }
  onCloseTip = () => {
    const box2Ref = this.box2Ref.current
    let scroll = window.innerHeight - 114
    let box2RefHeight = 0
    if (box2Ref) {
      box2RefHeight = box2Ref.clientHeight
    }
    scroll = scroll - box2RefHeight
    this.setState({
      scroll,
    })
  }
  handleOk() {
    window.open(
      'https://github.com/6fedcom/juejin-ariticle-liked-helper/issues'
    )
  }
  onCloseInput = () => {
    const box1Ref = this.box1Ref.current
    let scroll = window.innerHeight - 114
    let box1RefHeight = 0
    if (box1Ref) {
      box1RefHeight = box1Ref.clientHeight
    }

    scroll = scroll - box1RefHeight
    this.setState({
      scroll,
    })
  }

  handleTableChange = (pagination: any, filters: any, sorter: any) => {
    this.setState({
      pagination,
    })
  }
  showModal = () => {
    this.setState(
      {
        visible: true,
      },
      () => {
        setTimeout(() => {
          if (!isLoadPlayer) {
            window.polyvPlayer({
              wrap: '#previewArea',
              width: 600,
              height: 339,
              vid: 'q7c05c9lc1l14c152m4m8k6cm3n57ck46_7',
            })
          }
          isLoadPlayer = true
        })
      }
    )
  }
  handleSure = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { likeList, pagination, loading, scroll, isPc } = this.state

    let widthArray = ['40%', '10%', '8%', '16%', '8%', '8%', '10%']
    const columns: ColumnProps<Article>[] = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        ...this.getColumnSearchProps('title', '标题'),
        width: widthArray[0],
      },
      {
        title: '作者',
        dataIndex: 'author',
        key: 'author',
        sorter: (a: Article, b: Article) =>
          a.author.localeCompare(b.author, 'zh'),
        ...this.getColumnSearchProps('author', '作者'),
        width: widthArray[1],
      },
      {
        title: '类别',
        dataIndex: 'type',
        key: 'type',
        width: widthArray[2],
        sorter: (a: Article, b: Article) => a.type.localeCompare(b.type, 'zh'),
        ...this.getColumnSearchProps('type', '类别'),
      },
      {
        title: '标签',
        key: 'tagsString',
        dataIndex: 'tagsString',
        width: widthArray[3],
        ...this.getColumnSearchProps('tagsString', '标签'),
      },
      {
        title: '点赞数',
        dataIndex: 'collectionCount',
        key: 'collectionCount',
        width: widthArray[4],
        sorter: (a: Article, b: Article) =>
          a.collectionCount - b.collectionCount,
      },
      {
        title: '阅读量',
        dataIndex: 'viewsCount',
        key: 'viewsCount',
        width: widthArray[5],
        sorter: (a: Article, b: Article) => a.viewsCount - b.viewsCount,
      },
      {
        title: '发布时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: widthArray[6],
        render: (Time: string) => <div>{dayjs(Time).format('YYYY-MM-DD')}</div>,
        sorter: (a: Article, b: Article) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
    ]
    return (
      <ConfigProvider locale={zhCN}>
        <Modal
          width={650}
          closable={false}
          title="操作引导"
          visible={this.state.visible}
          footer={[
            <Button key="back" onClick={this.handleSure}>
              确认
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              提交意见
            </Button>,
          ]}
        >
          <div id="previewArea"></div>
        </Modal>
        <Alert
          message={
            <div className="table-tip" ref={this.box1Ref}>
              {!isPc && (
                <p>
                  您当前使用的是移动端，请复制网站地址：https://juejin.58fe.com
                  去pc端可以得到更好的体验
                </p>
              )}
              <b>复制你的掘金网站用户主页地址，粘贴到下面的输入框。</b>
              如果您觉得对你有帮助，您可以Crtl+D/command+D收藏本网址。
            </div>
          }
          type="success"
          closable
          closeText="关闭"
          afterClose={this.onCloseTip}
        />
        <Alert
          className="table-operations"
          message={
            <div ref={this.box2Ref}>
              {isPc ? (
                <div>
                  <Search
                    placeholder="例如：https://juejin.im/user/57fb24cf816dfa0056c1f8af"
                    enterButton="切换用户"
                    size="middle"
                    onSearch={this.changeUser}
                    style={{ width: 500 }}
                  />
                  <Button
                    style={{ marginLeft: '20px' }}
                    ghost
                    type="primary"
                    onClick={this.showModal}
                  >
                    操作引导
                  </Button>
                </div>
              ) : (
                <Search
                  placeholder="例如：https://juejin.im/user/2330620383999822"
                  enterButton="切换用户"
                  size="middle"
                  onSearch={this.changeUser}
                />
              )}
            </div>
          }
          type="info"
          closable
          closeText="关闭"
          afterClose={this.onCloseInput}
        />
        <div style={{ minHeight: window.innerHeight - 100 }}>
          <Table
            rowKey={(record) => record.originalUrl}
            tableLayout="auto"
            bordered
            columns={columns}
            dataSource={likeList}
            loading={loading}
            // expandable={{
            //   expandedRowRender: (record: Article,index) => <p>
            //     <a href={record.originalUrl} rel="noopener noreferrer" target="_blank">阅读原文</a>
            //   </p>,
            //   onExpandedRowsChange: (expandedRows) => {
            //     console.log(expandedRows)
            //     if (expandedRows.length) {
            //       // console.log
            //       // this.getArtcileContent(expandedRows.pop()
            //       //   .replace("https://juejin.im/post/", ''))
            //     }
            //   }
            // }}
            pagination={pagination}
            size="small"
            onChange={this.handleTableChange}
            scroll={{ y: scroll || window.innerHeight - 168 }}
          />
        </div>
        {/* <VirtualTable className="virtual-table" columns={columns} dataSource={likeList} scroll={{ y: 500, x: '100vw' }} /> */}
        <footer>
          本项目只做学习交流用途，
          <a
            rel="noopener noreferrer"
            href="https://github.com/6fed/juejin-ariticle-liked-helper"
            target="_blank"
          >
            点击此处查看源码
          </a>
          ,服务器搭建在
          <a
            rel="noopener noreferrer"
            href="https://www.aliyun.com/minisite/goods?userCode=jh5fwy2j&share_source=copy_link"
            target="_blank"
          >
            阿里云
          </a>
        </footer>
      </ConfigProvider>
    )
  }
}
export default withRouter<any, any>(ArticleList)
