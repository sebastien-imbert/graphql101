import "colors";
import "dotenv/config";
import { RESTDataSource } from '@apollo/datasource-rest';

class CitiesAPI extends RESTDataSource {

    override baseURL = 'https://geo.api.gouv.fr/communes'
    async getCity(city: string) {
        const data = await this.get(`?nom=${city}&fields=nom,codesPostaux,codeDepartement`);
        return data;
    }

}


export default CitiesAPI;
