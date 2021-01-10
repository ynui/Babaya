class Group {
    constructor(data) {
        this.name = data.name
        this.rules = data.rules
        this.description = data.description
        this.groupId = data.groupId || null
        this.users = data.users || []
        this.posts = data.posts || []
    }
    get data() {
        const data = {
            groupId: this.groupId,
            name: this.name,
            rules: this.rules,
            description: this.description,
            users: this.users,
            posts: this.posts,
        }
        return data
    }
}


module.exports = Group