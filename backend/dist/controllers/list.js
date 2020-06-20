"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('superagent');
let pageSize = 30;
//为啥用了async这种方法会导致接口加载的很慢。。。求大神解惑
// import { getUserLikeData } from "../models/List";
const handleResult = (list) => {
    let newList = [];
    list.map((item) => {
        console.log('item', item);
        if (item) {
            let obj = {};
            const { tags, category, collectionCount, createdAt, originalUrl, title, user, viewsCount, } = item;
            let tagsString = '';
            tags.map((tagItem, index) => {
                tagsString += `${tagItem.title}、`;
            });
            tagsString = tagsString.substr(0, tagsString.length - 1);
            const { username: author } = user;
            const { name: type } = category;
            obj = {
                tagsString,
                type,
                collectionCount,
                createdAt,
                originalUrl,
                title,
                author,
                viewsCount,
            };
            newList.push(obj);
        }
    });
    return newList;
};
const flatten = (arr) => {
    return arr.reduce((result, item) => {
        return result.concat(Array.isArray(item) ? flatten(item) : item);
    }, []);
};
exports.getLikeList = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method == 'OPTIONS') {
        res.send(200);
        /让options请求快速返回/;
    }
    let result = [];
    let getLikeListRes = res;
    let { userId } = req.params;
    let url = `https://user-like-wrapper-ms.juejin.im/v1/user/${userId}/like/entry`;
    request
        .get(`${url}?page=0&pageSize=${pageSize}`)
        .set('X-Juejin-Src', 'web')
        .end((err, res) => {
        if (err) {
            return console.log(err);
        }
        let entryList = res.body.d.entryList;
        const total = res.body.d.total;
        let pages = Math.ceil(total / pageSize);
        entryList = handleResult(entryList);
        let promiseList = [];
        for (let i = 1; i <= pages; i++) {
            promiseList.push(new Promise((resolve, reject) => {
                request
                    .get(`${url}?page=${i}&pageSize=${pageSize}`)
                    .set('X-Juejin-Src', 'web')
                    .end((err, res) => {
                    if (err) {
                        return console.log(err);
                    }
                    let entryList2 = JSON.parse(res.text).d.entryList;
                    entryList2 = handleResult(entryList2);
                    resolve(entryList2);
                });
            }));
        }
        Promise.all(promiseList).then((rspList) => {
            result = [...entryList, ...flatten(rspList)];
            getLikeListRes.status(200), getLikeListRes.json(result);
        });
    });
};
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
