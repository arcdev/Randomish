function loadDataPools() {
    const pools = [
        'address2Chunks',
        'areaCodes',
        'givenNames',
        'streets',
        'surnames',
        'zips',
        'adjectives',
        'animals',
        'companySuffix',
        'topLevelDomains',
    ];

    const rtn = {};
    pools.forEach(p => {
        rtn[p] = require(`./data-pool-${p}.json`);
        this.p = rtn[p];
    });

    return rtn;
}

function main(args) {
    const pools = loadDataPools();
    const Randomizer = require('./Randomizer');
    const inst = new Randomizer(
        pools.address2Chunks,
        pools.areaCodes,
        pools.givenNames,
        pools.streets,
        pools.surnames,
        pools.zips,
        pools.adjectives,
        pools.animals,
        pools.companySuffix,
        pools.topLevelDomains
    );

    let count = Number(args[0]);
    count = Number.isNaN(count) ? 2 : count;

    const people = [];
    for(let i=0; i < count; i++){
        const person = inst.buildPerson();
        people.push(person);
    }
    
    const json = count === 1 ? JSON.stringify(people[0]) : JSON.stringify(people)
    console.log(json);
}

main(process.argv.slice(2));
