const request = require('superagent')
let pageSize: number = 30

const handleResult = (list: any[] | undefined) => {
  if (list && list.length) {

    let newList: any[] = []
    list.map(item => {
      let obj = {}
      const { tags, category, collectionCount, content: description, createdAt, hot, originalUrl, title, user, viewsCount, objectId } = item
      const { username: author } = user
      const { name: type } = category
      obj = {
        tags, type, collectionCount, description, createdAt, hot, originalUrl, title, author, viewsCount, objectId
      }
      newList.push(obj)
    })
    return newList
  }

}


type getUserLikeEntryFunction = (page: number, userId: string) => Promise<any>;

export const getUserLikeEntry: getUserLikeEntryFunction = async (page, userId): Promise<any> => {
  let baseUrl = `https://user-like-wrapper-ms.juejin.im/v1/user/${userId}/like/entry`
  const res = await request
    .get(`${baseUrl}?page=${page}&pageSize=${pageSize}`)
    .set("X-Juejin-Src", "web")
  // console.log(res.text)
  return res.body
}

export const getUserLikeData = async (userId: string) => {
  try {
    let likeList: any[] = []

    let result = await getUserLikeEntry(0, userId)
    // result = JSON.parse(result.text)
    const total = result.d.total
    const pages = Math.ceil(total / pageSize)
    likeList = result.d.entryList
    for (var i = 1; i < pages; i++) {
      const result2 = await getUserLikeEntry(i, userId)
      const entryList = result2.d.entryList
      likeList = [...likeList, ...entryList]
    }

    return likeList
  } catch (err) {
    console.log(err)
    return err.response.data
  }
}
