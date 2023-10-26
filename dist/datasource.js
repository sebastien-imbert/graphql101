const { RESTDataSource } = require("@apollo/datasource-rest");
class PostAPI extends RESTDataSource {
    constructor() {
        super(...arguments);
        this.baseURL = "https://jsonplaceholder.typicode.com/";
    }
    getPosts() {
        return this.get('posts');
    }
}
export default PostAPI;
