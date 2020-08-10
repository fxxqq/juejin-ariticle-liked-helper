import { Request, Response, NextFunction } from 'express'
const request = require('superagent')
let cursor: string = '10'
export const getLikeList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Access-Control-Allow-Origin', '*')

  if (req.method == 'OPTIONS') {
    res.send(200)
    ;/让options请求快速返回/
  }
  let result: any = []
  let getLikeListRes = res

  let { userId } = req.params
  let url = `https://apinew.juejin.im/interact_api/v1/digg/query_page`
  let ret: any[] = []
  request
    .post(`${url}`)
    .send({
      user_id: userId,
      cursor,
      item_type: 2,
      sort_type: 2,
    })
    // .set('X-Juejin-Src', 'web')
    .end((err, res) => {
      if (err) {
        return console.log(err)
      }
      ret = [...JSON.parse(res.text).data]
      console.log(JSON.parse(res.text).count)
      cursor = parseInt(cursor) + 10 + ''
      let promiseList: any[] = []
      for (let i = 0; i < parseInt(JSON.parse(res.text).count) / 10; i++) {
        console.log(i)
        cursor = parseInt(cursor) + 10 + ''
        promiseList.push(
          new Promise((resolve) => {
            request
              .post(`${url}`)
              .send({
                user_id: userId,
                cursor,
                item_type: 2,
                sort_type: 2,
              })
              .end((err, res) => {
                if (err) {
                  return console.log(err)
                }
                resolve(JSON.parse(res.text).data)
              })
          })
        )
      }

      Promise.all(promiseList)
        .then((result) => {
          console.log([].concat(...result).length)
        })
        .catch((error) => {
          console.log(error)
        })
    })
}

//文章详情，暂时用不到
// export const getArtcileContent = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let getArtcileContentRes = res;

//   let { id } = req.params;
//   let url = `https://post-storage-api-ms.juejin.im/v1/getDetailData?&src=web&type=entryView&postId=${id}`;
//   request.get(url).end((err, res) => {
//     if (err) {
//       return console.log(err);
//     }
//     getArtcileContentRes.status(200),
//       getArtcileContentRes.json(res.body.d.content);
//   });
// };
