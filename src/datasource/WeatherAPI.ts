import "dotenv/config";
import { RESTDataSource } from '@apollo/datasource-rest';

export class WeatherAPI extends RESTDataSource {

  override baseURL = 'http://api.weatherapi.com/v1/current.json'

  async getWeather(city: string) {

    const data = await this.get(`?key=${process.env.API_WEATHER}&q=${city}&aqi=no`);
    return data;
  }
}

export default WeatherAPI;
