export const typeDefs = `#graphql

    type Post {
        id: ID!
        title: String!
        body: String!
    }

    type Query {
        getPosts: [Post]
    }
`;
