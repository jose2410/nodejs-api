const AWSMock = require('aws-sdk-mock');
const getPeopleHandler = require('../functions/get').obtenerPeopleHandler;

describe('Test para getPeople Lambda Function', () => {
  beforeAll(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
      callback(null, {
        Items: [
          {
            id: "1",
            nombre: "Luke Skywalker",
            altura: "172",
            masa: "77",
            color_cabello: "blond",
            color_piel: "fair",
            color_ojos: "blue",
            año_nacimiento: "19BBY",
            genero: "male",
            mundo_natal: "https://swapi.dev/api/planets/1/",
            peliculas: ["https://swapi.dev/api/films/1/"],
            especies: [],
            vehiculos: ["https://swapi.dev/api/vehicles/14/"],
            naves_estelares: ["https://swapi.dev/api/starships/12/"],
            creado: "2014-12-09T13:50:51.644000Z",
            editado: "2014-12-20T21:17:56.891000Z"
          }
        ]
      });
    });
  });

  afterAll(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('Debe traer registro de personajes desde DynamoDB', async () => {
    const result = await getPeopleHandler.handler();

    // Comprobaciones básicas
    expect(result.statusCode).toEqual(200);
    const responseBody = JSON.parse(result.body);
    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody).toHaveLength(1);
    expect(responseBody[0]).toHaveProperty('nombre', 'Luke Skywalker');
    
  });

});
