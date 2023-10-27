import "colors";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// import { RESTDataSource } from '@apollo/datasource-rest';
import CitiesAPI from "./datasource/CitiesAPI";
import WeatherAPI from "./datasource/WeatherAPI";



const resolvers = {
  Query: {
    getCity: (_: any, { city }: any, { dataSources }: any) => {
      console.log(dataSources.CitiesAPI.getCity(city));
      return dataSources.CitiesAPI.getCity(city);
    },
    getWeather: async (_: any, { cityname }: any, { dataSources }: any) => {
      const cityData = await dataSources.CitiesAPI.getCity(cityname);
      const weatherData = await dataSources.WeatherAPI.getWeather(cityData[0].nom);
      // const data = { weatherData, cityData };
      // console.log('Query:getWeather:data:', data);
      // return data;
      return weatherData;
    }
  },
  CityWeather: {
    location: ({ location }: any) => {
      const { name, lon, lat } = location;
      return {
        name() {
          return name;
        },
        lon() {
          return location.lon;
        },
        lat() {
          return location.lat;
        },
      }
    },
    temp: ({ current }: any) => ({

      fahrenheit() {
        return current.temp_f;
      },
      kelvin() {
        return current.temp_c + 273.15;
      },
      celsius() {
        return current.temp_c;
      },

    }),
    state({ current }: any) {
      return current.condition.text || 'Aucune donnée fiable disponible pour le moment.';
    },

    // city: {
    //   name() {
    //     return 'Paris';
    //   },
    //   zipCodes() {
    //     return ['75000'];
    //   },
    //   region() {
    //     return 'Île-de-France';
    //   },
    // }
  },
}

export const typeDefs = `#graphql
  type City {
    name: String!
    zipCodes: [String!]!
    region: String!
  }

  type CityWeather {
    location: WeatherLocation!
    temp: Temp
    state: String!
    # city: City
  }
  type Temp {
   fahrenheit: Float!
    kelvin: Float!
    celsius: Float!
  }

  type WeatherLocation {
    name: String!
    lon: Float!
    lat: Float!
  }

  
  
  type Query {
    getCity(city: String!): [City!]!
    getWeather(cityname: String!): CityWeather!
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
          WeatherAPI: new WeatherAPI({ cache }),
        },
      };
    },
    listen: { port: 4000 },
  });
  console.log(`🚀 Server ready at ${url} `.green.bold);
}

startApolloServer();
