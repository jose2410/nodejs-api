'use strict';

const AWS = require('aws-sdk');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.crearPersonaje = async (event) => {
  const data = JSON.parse(event.body);
  const swapiResponse = await axios.get('https://swapi.py4e.com/api/people/1/');
  const personajeData = {
    id: uuidv4(),
    nombre: swapiResponse.data.name,
    altura: swapiResponse.data.height,
    peso: swapiResponse.data.mass,
    color_cabello: swapiResponse.data.hair_color,
    color_piel: swapiResponse.data.skin_color,
    color_ojo: swapiResponse.data.eye_color,
    anio_nacimiento: swapiResponse.data.birth_year,
    genero: swapiResponse.data.gender,
    ...data
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: personajeData,
  };

  try {
    await dynamoDb.put(params).promise();
    return { statusCode: 200, body: JSON.stringify(params.Item) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

module.exports.obtenerPersonajes = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  try {
    const { Items } = await dynamoDb.scan(params).promise();
    return { statusCode: 200, body: JSON.stringify(Items) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};


module.exports.helloperson = async (event) => {
  const name = event.pathParameters.name; // Obtener el nombre de los parámetros de ruta
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hola ${name}`, //
        input: event,
      },
      null,
      2
    ),
  };
};

// Nueva función: createUser
module.exports.createUser = async (event) => {
  // agregar lógica para crear un usuario
  // extraer los datos del cuerpo de la solicitud
  const requestBody = JSON.parse(event.body);

  return {
    statusCode: 201,
    body: JSON.stringify(
      {
        message: 'Usuario creado exitosamente',
        userDetails: requestBody, // Enviar de vuelta los detalles recibidos
      },
      null,
      2
    ),
  };
};

// Nueva función: updateUser
module.exports.updateUser = async (event) => {
  // agregar lógica para actualizar un usuario
  // obtener el ID del usuario desde el pathParameter
  const userId = event.pathParameters.id;
  const requestBody = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Usuario ${userId} actualizado exitosamente`,
        updatedDetails: requestBody, // Enviar de vuelta los detalles actualizados (para demostración)
      },
      null,
      2
    ),
  };
};
