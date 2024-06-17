import { Engine } from 'json-rules-engine';

// Inicializando un nuevo motor de decisiones
let engine = new Engine();

// Definiendo un conjunto de reglas
engine.addRule({
    conditions: {
        any: [{
            all: [{
                fact: 'gameDuration',
                operator: 'equal',
                value: 40
            }, {
                fact: 'personalFoulCount',
                operator: 'greaterThanInclusive',
                value: 5
            }]
        }, {
            all: [{
                fact: 'gameDuration',
                operator: 'equal',
                value: 48
            }, {
                fact: 'personalFoulCount',
                operator: 'greaterThanInclusive',
                value: 6
            }]
        }]
    },
    event: { // Definimos el evento que se dispara cuando la regla se cumple
        type: 'fouledOut',
        params: {
            message: 'Player has fouled out!'
        }
    }
})

// Definiendo los hechos

let facts = {
    personalFoulCount: 6,
    gameDuration: 40
}

// Ejecutando el motor de decisiones
engine
    .run(facts)
    .then(({ events }) => {
        events.map(event => console.log(event.params.message))
    })