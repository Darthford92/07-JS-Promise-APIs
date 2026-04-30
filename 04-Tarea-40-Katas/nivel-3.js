/* ==========================================================================
   🗺️ NIVEL 3 - KATAS 21 A 30
   Consumo de APIs reales con fetch
   Objetivo: Hacer peticiones HTTP reales, parsear JSON y manejar errores
   de red. NECESITÁS INTERNET para ejecutar estas katas.

   APIs gratuitas usadas:
     - PokeAPI:       https://pokeapi.co/api/v2/
     - Rick & Morty:  https://rickandmortyapi.com/api/
     - JSONPlaceholder: https://jsonplaceholder.typicode.com/
========================================================================== */

/* --------------------------------------------------------------------------
   KATA 21: fetch básico - obtener un Pokémon
   Hacé un fetch a "https://pokeapi.co/api/v2/pokemon/pikachu".
   Parseá el JSON y mostrá SOLO: nombre, id y peso del Pokémon.
   Recordá: primero await fetch → después await .json()
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
async function kata21() {
  try {
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    const datos = await respuesta.json();
    console.log("Kata 21:", {
      nombre: datos.name,
      id: datos.id,
      peso: datos.weight
    });
  } catch (error) {
    // No lanzamos excepción, solo manejamos silenciosamente
    console.error(error);
  }
}

/* --------------------------------------------------------------------------
   KATA 22: Manejo del error 404
   Hacé una función async buscarPokemon(nombre) que:
     - Haga fetch a la PokeAPI con el nombre recibido.
     - Si respuesta.ok es false → lanzá un Error con
       "No existe ningún Pokémon llamado 'nombre'."
     - Si existe → mostrá nombre e id.
   Probala con "mewtwo" (existe) y "pikapika" (no existe).
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
async function buscarPokemon(nombre) {
  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (!respuesta.ok) {
      throw new Error(`No existe ningún Pokémon llamado '${nombre}'.`);
    }
    const datos = await respuesta.json();
    console.log(`Kata 22: ${datos.name} (#${datos.id})`);
  } catch (error) {
    if (error.message.includes("No existe")) {
      console.log("Kata 22 ❌:", error.message);
    } else {
      console.error(error);
    }
  }
}

/* --------------------------------------------------------------------------
   KATA 23: fetch a Rick & Morty API
   Hacé un fetch a "https://rickandmortyapi.com/api/character/1".
   Mostrá: nombre, especie, estado (status) y origen (origin.name).
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
async function kata23() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character/1");
  const datos = await respuesta.json();
  console.log("Kata 23:", {
    nombre: datos.name,
    especie: datos.species,
    estado: datos.status,
    origen: datos.origin.name
  });
}

/* --------------------------------------------------------------------------
   KATA 24: Mapear datos a una clase
   Creá una clase Personaje con constructor(data) que guarde:
     nombre, especie, estado, imagen.
   Hacé el fetch del personaje con ID 3 (Rick Sanchez) de la API
   de Rick & Morty e instanciá un objeto Personaje con los datos.
   Mostrá el objeto instanciado.
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
class Personaje {
  constructor(data) {
    this.nombre = data.name;
    this.especie = data.species;
    this.estado = data.status;
    this.imagen = data.image;
  }
}

async function kata24() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character/3");
  const datos = await respuesta.json();
  const personaje = new Personaje(datos);
  console.log("Kata 24:", personaje);
}

/* --------------------------------------------------------------------------
   KATA 25: fetch de una lista
   Hacé un fetch a "https://jsonplaceholder.typicode.com/posts".
   La API devuelve un array de 100 posts.
   Mostrá SOLO los primeros 5, con su id y title.
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
async function kata25() {
  const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await respuesta.json();
  const primeros5 = posts.slice(0, 5);
  primeros5.forEach(post => {
    console.log(`  #${post.id} - ${post.title}`);
  });
}

/* --------------------------------------------------------------------------
   KATA 26: fetch con URL dinámica
   Creá una función async obtenerUsuario(id) que haga fetch a:
     "https://jsonplaceholder.typicode.com/users/[id]"
   Y muestre: nombre, email y ciudad (address.city).
   Probala con los IDs 1, 3 y 7.
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
async function obtenerUsuario(id) {
  try {
    const respuesta = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!respuesta.ok) {
      throw new Error("No encontrado");
    }
    const user = await respuesta.json();
    console.log(`Kata 26 (id=${id}):`, {
      nombre: user.name,
      email: user.email,
      ciudad: user.address.city
    });
  } catch (error) {
    console.error("Kata 26 ❌:", `Usuario ${id} no encontrado`);
  }
}

/* --------------------------------------------------------------------------
   KATA 27: fetch y filtrar un array
   Hacé un fetch a "https://rickandmortyapi.com/api/character".
   La respuesta trae un objeto con { info, results }.
   Del array results, filtrá solo los personajes que estén vivos
   (status === "Alive") y mostrá cuántos hay y sus nombres.
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
async function kata27() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character");
  const data = await respuesta.json();
  const vivos = data.results.filter(p => p.status === "Alive");
  console.log(`Kata 27: ${vivos.length} personajes vivos`);
  vivos.forEach(p => {
    console.log(`  🟢 ${p.name}`);
  });
}

/* --------------------------------------------------------------------------
   KATA 28: Fetch encadenado (two-step)
   Primero obtenés el post con ID 1 de JSONPlaceholder.
   El post tiene un campo userId.
   Usá ese userId para hacer un SEGUNDO fetch y obtener los datos
   del usuario que escribió ese post.
   Mostrá: título del post + nombre del usuario que lo escribió.
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
async function kata28() {
  const resPost = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post = await resPost.json();
  const resUser = await fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`);
  const user = await resUser.json();
  console.log(`  Título: "${post.title}"`);
  console.log(`  Autor:  ${user.name}`);
}

/* --------------------------------------------------------------------------
   KATA 29: Buscar Pokémon por tipo
   Hacé un fetch a "https://pokeapi.co/api/v2/type/fire".
   La respuesta tiene un campo pokemon que es un array de objetos
   con la forma { pokemon: { name, url }, slot }.
   Mostrá los primeros 8 nombres de Pokémon de tipo fuego.
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
async function kata29() {
  const respuesta = await fetch("https://pokeapi.co/api/v2/type/fire");
  const data = await respuesta.json();
  const primeros8 = data.pokemon.slice(0, 8).map(item => item.pokemon.name);
  console.log("Kata 29:", primeros8);
}

/* --------------------------------------------------------------------------
   KATA 30: Mostrar solo campos seleccionados
   Hacé un fetch de los primeros 10 comentarios:
     "https://jsonplaceholder.typicode.com/comments?_limit=10"
   Mapeá el resultado a un array de objetos limpios con solo
   { id, nombre: name, email }.
   Mostrá el array limpio.
-------------------------------------------------------------------------- */

// TU CÓDIGO AQUÍ 👇
async function kata30() {
  const respuesta = await fetch("https://jsonplaceholder.typicode.com/comments?_limit=10");
  const comentarios = await respuesta.json();
  const limpios = comentarios.map(c => ({
    id: c.id,
    nombre: c.name,
    email: c.email
  }));
  console.log("Kata 30:", limpios);
}

module.exports = {
  kata21,
  buscarPokemon,
  kata23,
  Personaje,
  kata24,
  kata25,
  obtenerUsuario,
  kata27,
  kata28,
  kata29,
  kata30,
};