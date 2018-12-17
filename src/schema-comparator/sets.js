module.exports = {
    //差集
    difference(a, b) {
        return a.concat(b).filter(v => a.includes(v) && !b.includes(v))
    },
    //并集
    union(a, b) {
        return a.concat(b.filter(v => !a.includes(v)))
    },
    //交集
    intersection(a, b) {
        return a.filter(v => b.includes(v));
    }
}