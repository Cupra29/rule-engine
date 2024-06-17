import { Engine } from 'json-rules-engine';

const tipoNominaRules = {
    A: {
        m: [[0, 26, 100, 4900], [27, 27, 400, 4700], [28, 28, 900, 4600], [29, 29, 100, 4600], [30, Infinity, 600, 4500]],
        f: [[0, 24, 800, 4000], [25, 25, 800, 4200], [26, 26, 800, 4100], [27, 27, 600, 4200], [28, Infinity, 200, 4500]]
    },
    B: {
        m: [[0, 26, 1000, 4700], [27, 27, 600, 4400], [28, 28, 1000, 5000], [29, 29, 1000, 4400], [30, Infinity, 1000, 4900]],
        f: [[0, 24, 800, 4700], [25, 25, 700, 4200], [26, 26, 100, 4500], [27, 27, 600, 4300], [28, Infinity, 700, 4400]]
    },
    C: {
        m: [[0, 26, 400, 5000], [27, 27, 200, 4700], [28, 28, 200, 5000], [29, 29, 1000, 4200], [30, Infinity, 600, 4600]],
        f: [[0, 24, 200, 4600], [25, 25, 900, 4900], [26, 26, 700, 4600], [27, 27, 800, 4700], [28, Infinity, 100, 4000]]
    },
    D: {
        m: [[0, 26, 400, 4400], [27, 27, 300, 4700], [28, 28, 500, 4300], [29, 29, 900, 4900], [30, Infinity, 1000, 4300]],
        f: [[0, 24, 500, 5000], [25, 25, 1000, 4900], [26, 26, 600, 4700], [27, 27, 400, 5000], [28, Infinity, 700, 4300]]
    }
};

function calculoMotor(tipoNomina, fechaPrimerEmpleo, genero) {
    const engine = new Engine();

    const fechaActual = new Date();
    const fechaIngreso = new Date(fechaPrimerEmpleo);
    const diferenciaMeses = (fechaActual.getFullYear() - fechaIngreso.getFullYear()) * 12 + (fechaActual.getMonth() - fechaIngreso.getMonth());

    const reglas = tipoNominaRules[tipoNomina][genero].map(([min, max, montoMinimo, montoMaximo]) => ({
        conditions: {
            all: [
                { fact: 'diferenciaMeses', operator: 'greaterThanInclusive', value: min },
                { fact: 'diferenciaMeses', operator: 'lessThanInclusive', value: max }
            ]
        },
        event: {
            type: 'monto',
            params: {
                montoMinimo,
                montoMaximo
            }
        }
    }));

    reglas.forEach(rule => {
        engine.addRule(rule);
    });

    const facts = { diferenciaMeses };

    return engine.run(facts)
        .then(results => {
            const montoMinimo = results.events.find(event => event.type === 'monto').params.montoMinimo;
            const montoMaximo = results.events.find(event => event.type === 'monto').params.montoMaximo;

            const p1 = montoMinimo + Math.sqrt(montoMaximo - montoMinimo);
            const p2 = montoMinimo + 0.0175 * (montoMaximo - montoMinimo);

            const recomendacionLinea = Math.max(p1, p2);

            return {
                montoMinimo,
                montoMaximo,
                recomendacionLinea
            };
        })
        .catch(error => {
            throw new Error('No se encontró una regla correspondiente para los datos proporcionados.');
        });
}


calculoMotor('A', '2022-06-12', 'f')
    .then(result => console.log(result))
    .catch(error => console.error(error));

calculoMotor('B', '1993-12-30', 'f')
    .then(result => console.log(result))
    .catch(error => console.error(error));

calculoMotor('C', '2020-09-19', 'm')
    .then(result => console.log(result))
    .catch(error => console.error(error));

calculoMotor('D', '2019-01-15', 'm')
    .then(result => console.log(result))
    .catch(error => console.error(error));
    console.log('D');

