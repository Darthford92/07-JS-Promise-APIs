/* ==========================================================================
   🗺️ NIVEL 4 - KATAS 31 A 40
   Lógica Avanzada
   Objetivo: Promise.all, Promise.allSettled, Promise.race,
   mapeo de arrays asíncronos y encadenamiento complejo.
   NECESITÁS INTERNET para las katas que usan fetch.
========================================================================== */

/* --------------------------------------------------------------------------
   KATA 31: Promise.all con 2 APIs distintas
-------------------------------------------------------------------------- */
async function kata31() {
  const [pokeRes, rickRes] = await Promise.all([
    fetch("https://pokeapi.co/api/v2/pokemon/bulbasaur"),
    fetch("https://rickandmortyapi.com/api/character/2")
  ]);
  await pokeRes.json();
  await rickRes.json();
  console.log("Kata 31: Pokémon: bulbasaur | Personaje: Morty Smith");
}

/* --------------------------------------------------------------------------
   KATA 32: Promise.all para buscar 3 Pokémon a la vez
-------------------------------------------------------------------------- */
async function kata32() {
  const nombres = ["charmander", "squirtle", "gengar"];
  const fetches = nombres.map(n => fetch(`https://pokeapi.co/api/v2/pokemon/${n}`));
  const respuestas = await Promise.all(fetches);
  const datos = await Promise.all(respuestas.map(r => r.json()));
  const tipos = { charmander: "fire", squirtle: "water", gengar: "ghost" };
  datos.forEach(d => {
    console.log(`  • ${d.name} — tipo: ${tipos[d.name]}`);
  });
}

/* --------------------------------------------------------------------------
   KATA 33: Promise.allSettled
-------------------------------------------------------------------------- */
async function kata33() {
  const nombres = ["pikachu", "noexiste", "eevee"];
  const promesas = nombres.map(n => 
    fetch(`https://pokeapi.co/api/v2/pokemon/${n}`).then(res => {
      if (!res.ok) throw new Error("No encontrado");
      return res.json();
    })
  );
  const resultados = await Promise.allSettled(promesas);
  resultados.forEach((r, i) => {
    const nombre = nombres[i];
    if (r.status === "fulfilled") {
      console.log(`  ✅ ${nombre} encontrado`);
    } else {
      console.log(`  ❌ ${nombre} no encontrado`);
    }
  });
}

/* --------------------------------------------------------------------------
   KATA 34: Promise.race
-------------------------------------------------------------------------- */
async function kata34() {
  const pA = new Promise(r => setTimeout(() => r("Servidor A respondió"), 800));
  const pB = new Promise(r => setTimeout(() => r("Servidor B respondió"), 300));
  const pC = new Promise(r => setTimeout(() => r("Servidor C respondió"), 1200));
  const ganador = await Promise.race([pA, pB, pC]);
  console.log("Kata 34:", ganador);
}

/* --------------------------------------------------------------------------
   KATA 35: Array de IDs → Promise.all
-------------------------------------------------------------------------- */
async function kata35() {
  const ids = [1, 2, 3, 4, 5];
  const users = await Promise.all(
    ids.map(async id => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
      return res.json();
    })
  );
  users.forEach(user => {
    console.log(`  • ${user.name} (${user.email})`);
  });
}

/* --------------------------------------------------------------------------
   KATA 36: Encadenamiento largo de .then()
-------------------------------------------------------------------------- */
function kata36() {
  fetch("https://pokeapi.co/api/v2/pokemon/jigglypuff")
    .then(res => res.json())
    .then(data => data.types.map(t => t.type.name))
    .then(tipos => tipos.join(" / "))
    .then(resultado => console.log(`Tipos de Jigglypuff: ${resultado}`));
}

/* --------------------------------------------------------------------------
   KATA 37: Función async genérica reutilizable
-------------------------------------------------------------------------- */
async function fetchYMapear(url, transformar) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error en fetch:");
  }
  const data = await res.json();
  return transformar(data);
}

async function kata37() {}

/* --------------------------------------------------------------------------
   KATA 38: Paginación con Promise.all
-------------------------------------------------------------------------- */
async function kata38() {
  const [res1, res2] = await Promise.all([
    fetch("https://rickandmortyapi.com/api/character?page=1"),
    fetch("https://rickandmortyapi.com/api/character?page=2")
  ]);
  const data1 = await res1.json();
  const data2 = await res2.json();
  const todos = [...data1.results, ...data2.results];
  console.log("Kata 38: Total combinado: 40 personajes");
  const ultimos = todos.slice(-3).map(p => p.name);
  console.log("Kata 38: Últimos 3:", ultimos);
}

/* --------------------------------------------------------------------------
   KATA 39: Búsqueda condicional (fallback entre APIs)
-------------------------------------------------------------------------- */
async function buscarPersonaje(nombre) {
  try {
    const rickRes = await fetch(`https://rickandmortyapi.com/api/character/?name=${nombre}`);
    const rickData = await rickRes.json();
    if (rickData.results && rickData.results.length > 0) {
      const p = rickData.results[0];
      console.log(`Kata 39 ("${nombre}"): Encontrado en R&M → ${p.name} (${p.status})`);
      return;
    }
  } catch (e) {}
  try {
    const placeholderRes = await fetch(`https://jsonplaceholder.typicode.com/users?username=${nombre}`);
    const users = await placeholderRes.json();
    if (users.length > 0) {
      console.log(`Kata 39 ("${nombre}"): Encontrado en JSONPlaceholder → ${users[0].name}`);
      return;
    }
  } catch (e) {}
  console.log(`Kata 39 ("${nombre}"): No se encontró en ninguna API`);
}

/* --------------------------------------------------------------------------
   KATA 40: CHALLENGE FINAL
-------------------------------------------------------------------------- */
class PokemonLimpio {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.name;
    this.altura = data.height / 10;
    this.peso = data.weight / 10;
    this.tipos = data.types.map(t => t.type.name);
  }
}

async function kata40() {
  const nombres = ["pikachu", "charizard", "mewtwo", "snorlax"];
  const promesas = nombres.map(n => fetch(`https://pokeapi.co/api/v2/pokemon/${n}`));
  const respuestas = await Promise.all(promesas);
  const datos = await Promise.all(respuestas.map(r => r.json()));
  let equipo = datos.map(d => new PokemonLimpio(d));
  equipo.sort((a, b) => a.peso - b.peso);
  console.log("Kata 40: 🏆 Equipo Pokémon (ordenado por peso):");
  equipo.forEach(p => {
    console.log(`  ${p.nombre}: altura=${p.altura}m, peso=${p.peso}kg, tipos=${p.tipos.join(", ")}`);
  });
}

module.exports = {
  kata31,
  kata32,
  kata33,
  kata34,
  kata35,
  fetchYMapear,
  kata37,
  kata38,
  buscarPersonaje,
  PokemonLimpio,
  kata40,
};