const axios = require('axios');
export const resolvers = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await axios.get('https://jsonplaceholder.typicode.com/posts');
                return posts.data;
            }
            catch (err) {
                throw new Error(err);
            }
        }
    }
};
