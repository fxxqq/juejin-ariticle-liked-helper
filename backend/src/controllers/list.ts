import { Request, Response, NextFunction } from "express";
const request = require('superagent')
let pageSize: number = 30
//为啥用了async这种方法会导致接口加载的很慢。。。求大神解惑
// import { getUserLikeData } from "../models/List";


function handleResult (list: any[]) {
  let newList: any[] = []
  list.map(item => {
    let obj = {}
    const { tags, category, collectionCount, content: description, createdAt, hot, originalUrl, title, user, viewsCount, objectId } = item
    tags.map((tagItem, index) => {
      tags[index] = tagItem.title
    })
    const { username: author } = user
    const { name: type } = category
    obj = {
      tags, type, collectionCount, createdAt, hot, originalUrl, title, author, viewsCount, objectId
    }
    newList.push(obj)
  })
  return newList
}

export const getLikeList = (req: Request, res: Response, next: NextFunction) => {
  let result: any = []
  let getLikeListRes = res

  let { userId } = req.params
  let url = `https://user-like-wrapper-ms.juejin.im/v1/user/${userId}/like/entry`
  request.get(`${url}?page=0&pageSize=${pageSize}`).set("X-Juejin-Src", "web")
    .end((err: any, res: any) => {
      if (err) {
        return console.log(err)
      }

      let entryList = res.body.d.entryList
      const total = res.body.d.total
      let pages = Math.ceil(total / pageSize)
      entryList = handleResult(entryList)
      result = [...entryList]


      let promiseList: any[] = [];
      for (let i = 1; i < pages + 1; i++) {
        promiseList.push(new Promise((resolve, reject) => {
          request.get(`${url}?page=${i}&pageSize=${pageSize}`).set("X-Juejin-Src", "web")
            .end((err: any, res: any) => {
              if (err) {
                return console.log(err)
              }
              let entryList = JSON.parse(res.text).d.entryList
              entryList = handleResult(entryList)
              resolve(entryList)
            })
        }));


      }

      Promise.all(promiseList).then((rspList) => {
        result = [...result.concat(...rspList)]
        console.log(result.length, rspList.length)
        getLikeListRes.status(200),
          getLikeListRes.json(result)

      })

    })


};