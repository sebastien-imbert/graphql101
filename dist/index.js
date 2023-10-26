import "colors";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { RESTDataSource } from '@apollo/datasource-rest';
class CitiesAPI extends RESTDataSource {
    async getCity(city) {
        const data = await this.get(`https://geo.api.gouv.fr/communes?nom=${city}&fields=nom,codesPostaux,codeDepartement`);
        return data;
    }
    async getWeather(cityname) {
        const data = await this.get(`http://api.weatherapi.com/v1/current.json?key=148e76d20eed4864bb2142333232610&q=${cityname}&aqi=no`);
        return data;
    }
}
const resolvers = {
    Query: {
        getCity: (_, { city }, { dataSources }) => {
            console.log(dataSources.CitiesAPI.getCity(city));
            return dataSources.CitiesAPI.getCity(city);
        },
        getWeather: (_, { cityname }, { dataSources }) => {
            return dataSources.CitiesAPI.getWeather(cityname);
        }
    },
    CityWeather: {
        getCity: (_, { city }, { dataSources }) => {
            return dataSources.CitiesAPI.getCity(city);
        },
        getWeather: ({ nom }, { city }, { dataSources }) => {
            return dataSources.CitiesAPI.getWeather(nom);
        }
    }
};
export const typeDefs = `#graphql
    type City {
      nom: String!
      codesPostaux: [String!]!
      codeDepartement: String!
    }

    type CityWeather {
      location: WeatherLocation
      current: WeatherCurrent
      getCity(city: String!): [City!]!
      getWeather(nom: String!): CityWeather!
    }

    type WeatherLocation {
      name: String!
    }

    type WeatherCurrent {
      condition: WeatherCurrentCondition
      temp_c: Float!
    }

    type WeatherCurrentCondition {
      text: String!
    }


    type Query {
      getCity(city: String!): [City!]!
      getWeather(nom: String!): CityWeather!
      getCityWeather(city: String!): CityWeather!
    }
`;
const server = new ApolloServer({ typeDefs, resolvers });
async function startApolloServer() {
    const { url } = await startStandaloneServer(server, {
        context: async () => {
            const { cache } = server;
            return {
                dataSources: {
                    CitiesAPI: new CitiesAPI({ cache }),
                },
            };
        },
        listen: { port: 4000 },
    });
    console.log(`🚀 Server ready at ${url}`.green.bold);
}
startApolloServer();
