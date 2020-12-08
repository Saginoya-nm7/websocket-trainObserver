const ID_STRSET = "abcdefghijklmnopqrstuvwxyz0123456789";


// length 文字のランダムな文字列を生成
// 参考元: https://qiita.com/fukasawah/items/db7f0405564bdc37820e
exports.makeRandomStr = (length) => Array.from(Array(length)).map(() => ID_STRSET[Math.floor(Math.random() * ID_STRSET.length)]).join("");


// Pythonのcollections.defaultDictみたいな振る舞いをするクラス
// 参考元: https://stackoverflow.com/questions/19127650/defaultdict-equivalent-in-javascript
exports.defaultDict = class DefaultDict {
    constructor(defaultInit) {
        return new Proxy({}, {
            get: (target, name) => name in target ?
                target[name] :
                (target[name] = typeof defaultInit === 'function' ?
                    new defaultInit().valueOf() :
                    defaultInit)
        })
    }
}