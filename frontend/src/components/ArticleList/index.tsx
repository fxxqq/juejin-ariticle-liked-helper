import React from 'react';
import moment from 'moment'
import axios from 'axios'
import {
  Table, Tag, Button, Input, Form, Radio,
  Popconfirm, message, Select
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import './table.css';
import { Article, State, Props, filterDropdownType } from './interface';
// import VirtualTable from './virtualList'
const { Option } = Select;


export default class ArticleList extends React.Component<Props, State> {
  state: State = {
    pagination: {
      position: 'topLeft',
      pageSize: 10
    },
    likeList: [],
    searchText: '',
    searchedColumn: '',
    loading: true,
    // rowSelection: {},
    scroll: undefined,

    filteredInfo: null,
  };
  searchInput: any;
  constructor(props: any) {
    super(props);
    this.searchInput = null;
  }
  componentDidMount () {

    this.getLikeList()
  }
  getLikeList () {
    const { id } = this.props
    if (id) {
      axios.get(`/api/getList/${id}`)
        .then((response) => {
          // console.log(response.data);
          this.setState({
            likeList: response.data,
            loading: false
          })
        })
        .catch(function (error) {
          console.log(error);
        })
    } else {

    }
  }
  getColumnSearchProps = (dataIndex: string, type: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: filterDropdownType) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`根据关键字查找${type}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          查找
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          清除
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: Boolean) => {

      if (visible) {
        setTimeout(() =>
          // console.log("onFilterDropdownVisibleChange", this)
          this.searchInput.select()
        );
      }
    },
    render: (text: string, record: Article) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          dataIndex === 'title' ? (<a href={record.originalUrl} target="_blank" rel="noopener noreferrer">{text}</a>) : text
        ),
  });

  handleSearch = (selectedKeys: any, confirm: () => void, dataIndex: string) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  handleDelete = (key: string) => {
    message.info('开发中...');
  };
  handleReset = (clearFilters: any) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleRowSelectionChange () { };

  handleSelectChange = (value: string) => {
    if (value) {
      this.setState({
        pagination: { pageSize: value }
      })
    }
  };
  clearAll = () => {
    this.setState({
      filteredInfo: null,
    });
  };
  render () {
    let widthArray = ["35%", "8%", "8%", "15%", "10%", "8%", "8%", "8%"]
    const columns: ColumnProps<Article>[] = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        ...this.getColumnSearchProps('title', "标题"),
        width: widthArray[0],
      },
      {
        title: '作者',
        dataIndex: 'author',
        key: 'author',
        sorter: (a: Article, b: Article) => a.author.localeCompare(b.author, 'zh'),
        ...this.getColumnSearchProps('author', "作者"),
        width: widthArray[1],
      },
      {
        title: '类别',
        dataIndex: 'type',
        key: 'type',
        width: widthArray[2],
        sorter: (a: Article, b: Article) => a.type.localeCompare(b.type, 'zh'),
        ...this.getColumnSearchProps('type', "类别"),
      },
      {
        title: '标签',
        key: 'tags',
        dataIndex: 'tags',
        width: widthArray[3],

        render: (tags: any[]) => (
          <span>
            {tags.map((tag, index) => {
              return (
                <Tag color={'volcano'} key={index}>
                  {tag}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: '点赞数目',
        dataIndex: 'collectionCount',
        key: 'collectionCount',
        width: widthArray[4],
        sorter: (a: Article, b: Article) => a.collectionCount - b.collectionCount,
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
        render: (Time: string) => <div>{moment(Time).format("YYYY-MM-DD")}</div>,
        sorter: (a: Article, b: Article) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: widthArray[7],
        render: (text: string, record: Article) =>
          this.state.likeList.length >= 1 ? (
            <div>
              <Popconfirm title="确定取消?" onConfirm={() => this.handleDelete(record.objectId)}>
                <Button>取消赞</Button>
              </Popconfirm>
            </div>

          ) : null,
      },
    ];
    const { likeList, pagination, loading } = this.state

    return (
      <div>
        <Table
          rowKey={record => record.objectId}
          tableLayout="auto"
          columns={columns}
          dataSource={likeList}
          loading={loading}
          expandable={{
            expandedRowRender: (record: Article) => <p >
              {record.description}
              <a href={record.originalUrl} rel="noopener noreferrer" target="_blank">阅读全文</a>
            </p>,
            rowExpandable: (record: Article) => record.description !== '没有摘要',
          }}
          pagination={pagination}
          size="small"
          scroll={{ y: 500 }}
        />

        {/* <VirtualTable className="virtual-table" columns={columns} dataSource={likeList} scroll={{ y: 500, x: '100vw' }} /> */}

      </div>
    );
  }
}