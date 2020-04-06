"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('superagent');
let pageSize = 30;
const handleResult = (list) => {
    if (list && list.length) {
        let newList = [];
        list.map(item => {
            let obj = {};
            const { tags, category, collectionCount, content: description, createdAt, hot, originalUrl, title, user, viewsCount, objectId } = item;
            const { username: author } = user;
            const { name: type } = category;
            obj = {
                tags, type, collectionCount, description, createdAt, hot, originalUrl, title, author, viewsCount, objectId
            };
            newList.push(obj);
        });
        return newList;
    }
};
exports.getUserLikeEntry = (page, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let baseUrl = `https://user-like-wrapper-ms.juejin.im/v1/user/${userId}/like/entry`;
    const res = yield request
        .get(`${baseUrl}?page=${page}&pageSize=${pageSize}`)
        .set("X-Juejin-Src", "web");
    // console.log(res.text)
    return res.body;
});
exports.getUserLikeData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let likeList = [];
        let result = yield exports.getUserLikeEntry(0, userId);
        // result = JSON.parse(result.text)
        const total = result.d.total;
        const pages = Math.ceil(total / pageSize);
        likeList = result.d.entryList;
        for (var i = 1; i < pages; i++) {
            const result2 = yield exports.getUserLikeEntry(i, userId);
            const entryList = result2.d.entryList;
            likeList = [...likeList, ...entryList];
        }
        return likeList;
    }
    catch (err) {
        console.log(err);
        return err.response.data;
    }
});
