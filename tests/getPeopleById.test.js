const AWSMock = require('aws-sdk-mock');
const getPeopleByIdHandler = require('../functions/get').obtenerPeopleIdHandler;

describe('Test para getPeopleById Lambda Function', () => {
  beforeAll(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      callback(null, {
        Item: {
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
      });
    });
  });

  afterAll(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('debe traer un registro desde DynamoDB', async () => {
    const event = {
      pathParameters: {
        id: '1'
      }
    };

    const result = await getPeopleByIdHandler.handler(event);

    // Comprobaciones básicas
    expect(result.statusCode).toEqual(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody).toHaveProperty('nombre', 'Luke Skywalker');
    
  });

});
