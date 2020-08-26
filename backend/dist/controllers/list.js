"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('superagent');
let pageSize = 10;
exports.getLikeList = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method == 'OPTIONS') {
        res.send(200);
        // 让options请求快速返回
    }
    let result = [];
    let getLikeListRes = res;
    let { userId } = req.params;
    let url = `https://apinew.juejin.im/interact_api/v1/digg/query_page`;
    let ret = [];
    let cursor = '10';
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
            return console.log(err);
        }
        ret = JSON.parse(res.text).data;
        // console.log(ret)
        let promiseList = [];
        let listCount = JSON.parse(res.text).count;
        for (let i = 0; i < Math.ceil(listCount / pageSize); i++) {
            cursor = parseInt(cursor) + pageSize + '';
            if (Number(cursor) < listCount) {
                promiseList.push(new Promise((resolve) => {
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
                            return console.log(err);
                        }
                        // console.log(JSON.parse(res.text).data)
                        resolve(JSON.parse(res.text).data);
                    });
                }));
            }
            else {
                promiseList.push(new Promise((resolve) => {
                    request
                        .post(`${url}`)
                        .send({
                        user_id: userId,
                        cursor: listCount + '',
                        item_type: 2,
                        sort_type: 2,
                    })
                        .end((err, res) => {
                        if (err) {
                            return console.log(err);
                        }
                        resolve(JSON.parse(res.text).data);
                    });
                }));
            }
        }
        Promise.all(promiseList)
            .then((result) => {
            if (!result.length) {
                getLikeListRes.status(200);
                getLikeListRes.json({
                    code: 70001,
                    message: '接口请求超时',
                });
            }
            let likeList = ret.concat(...(result || []));
            likeList = handle(likeList);
            getLikeListRes.status(200);
            getLikeListRes.json(likeList);
        })
            .catch((error) => {
            console.log(error);
        });
    });
};
function handle(likeList) {
    let simpleLikeList = [];
    for (var i = 0; i < likeList.length; i++) {
        let item = {};
        if (likeList[i]) {
            let tags = likeList[i].tags;
            let tagsString = '';
            if (tags.length) {
                tags.map((item) => {
                    tagsString += item.tag_name;
                });
            }
            let type = likeList[i].category.category_name;
            let collectionCount = likeList[i].article_info.digg_count;
            let viewsCount = likeList[i].article_info.view_count;
            let createdAt = Number(likeList[i].article_info.ctime) * 1000;
            let articleId = likeList[i].article_id;
            let title = likeList[i].article_info.title;
            let author = likeList[i].author_user_info.user_name;
            item = {
                articleId,
                type,
                collectionCount,
                createdAt,
                title,
                author,
                viewsCount,
                tagsString,
            };
            simpleLikeList.push(item);
        }
    }
    return simpleLikeList;
}
