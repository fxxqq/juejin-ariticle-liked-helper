"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('superagent');
let pageSize = 30;
//为啥用了getUserLikeData这种方法会导致接口加载的很慢。。。求大神解惑
// import { getUserLikeData, getUserLikeEntry } from "../models/List";
function handleResult(list) {
    let newList = [];
    list.map(item => {
        let obj = {};
        const { tags, category, collectionCount, content: description, createdAt, hot, originalUrl, title, user, viewsCount, objectId } = item;
        const { username: author } = user;
        const { name: type } = category;
        obj = {
            tags, type, collectionCount, createdAt, hot, originalUrl, title, author, viewsCount, objectId
        };
        newList.push(obj);
    });
    return newList;
}
let result = [];
const getInfo = (userId) => {
    let url = `https://user-like-wrapper-ms.juejin.im/v1/user/${userId}/like/entry`;
    request.get(`${url}?page=0&pageSize=${pageSize}`).set("X-Juejin-Src", "web").end((err, res) => {
        if (err) {
            return console.log(err);
        }
        // console.log(res.text)
        let entryList = res.body.d.entryList;
        const total = res.body.d.total;
        let pages = Math.ceil(total / pageSize);
        entryList = handleResult(entryList);
        result = [...entryList];
        for (var i = 1; i < pages; i++) {
            request.get(`${url}?page=${i}&pageSize=${pageSize}`).set("X-Juejin-Src", "web")
                .end((err, res) => {
                if (err) {
                    return console.log(err);
                }
                let entryList = JSON.parse(res.text).d.entryList;
                entryList = handleResult(entryList);
                result = [...result, ...entryList];
            });
        }
    });
};
exports.getLikeList = (req, res, next) => {
    // let result = getUserLikeEntry(0, req.params.userId)
    // console.log(result)
    // result.then(aaa => {
    //   res.status(200),
    //     res.json(aaa)
    // })
    getInfo(req.params.userId);
    res.status(200),
        res.json(result);
};
