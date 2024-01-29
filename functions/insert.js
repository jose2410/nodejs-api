const { errorResponse } = require('./common-methods/responses');
const { create_UUID } = require('./common-methods/genericMethods');
const dynamodb = require('aws-sdk/clients/dynamodb');
const axios = require('axios');
const db = new dynamodb.DocumentClient();
const swapiUrl = 'https://swapi.dev/api/people/';


const peopleTable = process.env.PEOPLE_TABLE;

const NOMBRE_LOG = "INSERT PEOPLE";

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const TIME_ZONE = 'America/Bogota';
const FORMAT_DATE = 'YYYY-MM-DDTHH:mm:ss.SSS';

exports.crearPeopleHandler = async (event) => {
    try {
      // Obtener el ID del personaje de SWAPI de la solicitud
      const { personajeId } = JSON.parse(event.body);
  
      // Obtener datos de SWAPI
      const swapiResponse = await axios.get(`${swapiUrl}${personajeId}`);
      const personaje = swapiResponse.data;
  
      // Transformar datos
      const item = {
        id: personaje.url,
        nombre: personaje.name, // "name" -> "nombre"
        altura: personaje.height, // "height" -> "altura"
        masa: personaje.mass, // "mass" -> "masa"
        color_cabello: personaje.hair_color, // "hair_color" -> "color_cabello"
        color_piel: personaje.skin_color, // "skin_color" -> "color_piel"
        color_ojos: personaje.eye_color, // "eye_color" -> "color_ojos"
        año_nacimiento: personaje.birth_year, // "birth_year" -> "año_nacimiento"
        genero: personaje.gender, // "gender" -> "genero"
        mundo_natal: personaje.homeworld, // "homeworld" -> "mundo_natal"
        peliculas: personaje.films, // "films" -> "peliculas"
        especies: personaje.species, // "species" -> "especies"
        vehiculos: personaje.vehicles, // "vehicles" -> "vehiculos"
        naves_estelares: personaje.starships, // "starships" -> "naves_estelares"
        creado: personaje.created, // "created" -> "creado"
        editado: personaje.edited, // "edited" -> "editado"
      };
  
      // Guardar en DynamoDB
      await db.put({
        TableName: process.env.PEOPLE_TABLE,
        Item: item,
      }).promise();
  
      return { statusCode: 200, body: JSON.stringify(item) };
    } catch (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};

