"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('superagent');
let pageSize = 30;
//为啥用了async这种方法会导致接口加载的很慢。。。求大神解惑
// import { getUserLikeData } from "../models/List";
function handleResult(list) {
    let newList = [];
    list.map(item => {
        let obj = {};
        const { tags, category, collectionCount, createdAt, hot, originalUrl, title, user, viewsCount } = item;
        tags.map((tagItem, index) => {
            tags[index] = tagItem.title;
        });
        const { username: author } = user;
        const { name: type } = category;
        obj = {
            tags, type, collectionCount, createdAt, hot, originalUrl, title, author, viewsCount
        };
        newList.push(obj);
    });
    return newList;
}
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
    request.get(`${url}?page=0&pageSize=${pageSize}`).set("X-Juejin-Src", "web")
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
                request.get(`${url}?page=${i}&pageSize=${pageSize}`).set("X-Juejin-Src", "web")
                    .end((err, res) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(i);
                    let entryList2 = JSON.parse(res.text).d.entryList;
                    entryList2 = handleResult(entryList2);
                    resolve(entryList2);
                });
            }));
        }
        Promise.all(promiseList).then((rspList) => {
            result = [...entryList, ...rspList.flat()];
            console.log(result, result.length, rspList.flat().length);
            getLikeListRes.status(200),
                getLikeListRes.json(result);
        });
    });
};
exports.getArtcileContent = (req, res, next) => {
    let result = [];
    let getArtcileContentRes = res;
    let { id } = req.params;
    let url = `https://post-storage-api-ms.juejin.im/v1/getDetailData?&src=web&type=entryView&postId=${id}`;
    request.get(url)
        .end((err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log(res.body);
        getArtcileContentRes.status(200),
            getArtcileContentRes.json(res.body.d.content);
    });
};
