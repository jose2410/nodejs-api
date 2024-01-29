const AWSMock = require('aws-sdk-mock');
const axios = require('axios');
const createPeopleHandler = require('../functions/insert').crearPeopleHandler;
jest.mock('axios');

describe('Test para createPeople Lambda Function', () => {
  beforeAll(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, { statusCode: 200 });
    });
  });

  afterAll(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('debe guardar un personaje de StarsWars en DynamoDB', async () => {
    // Mock response from SWAPI
    const mockSwapiResponse = {
      data: {
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
        hair_color: "blond",
        skin_color: "fair",
        eye_color: "blue",
        birth_year: "19BBY",
        gender: "male",
        homeworld: "https://swapi.dev/api/planets/1/",
        films: [
          "https://swapi.dev/api/films/1/",
          "https://swapi.dev/api/films/2/",
          "https://swapi.dev/api/films/3/",
          "https://swapi.dev/api/films/6/"
        ],
        species: [],
        vehicles: [
          "https://swapi.dev/api/vehicles/14/",
          "https://swapi.dev/api/vehicles/30/"
        ],
        starships: [
          "https://swapi.dev/api/starships/12/",
          "https://swapi.dev/api/starships/22/"
        ],
        created: "2014-12-09T13:50:51.644000Z",
        edited: "2014-12-20T21:17:56.891000Z",
        url: "https://swapi.dev/api/people/1/"
      }
    };

    axios.get.mockResolvedValue(mockSwapiResponse);

    // Simular evento de entrada
    const event = {
      body: JSON.stringify({ personajeId: 1 })
    };

    const result = await createPeopleHandler.handler(event);

    // Comprobaciones básicas
    expect(result.statusCode).toEqual(200);
    expect(axios.get).toHaveBeenCalledWith('https://swapi.dev/api/people/1/');
    expect(AWSMock.DynamoDB.DocumentClient.prototype.put).toHaveBeenCalled();

  });

});
