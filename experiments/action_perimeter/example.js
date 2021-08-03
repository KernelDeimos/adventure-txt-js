let itemModel = {
    properties: [
        {
            $: 'string',
            name: 'name',
        },
        {
            $: 'choice',
            name: 'magic',
            options: ['NEUTRAL', 'FIRE', 'WATER'],
        },
        ...[
            'durability', 'sharpness', 'hardness', 'weight',
            'magicness', 'aerodynamicness', 'nutrition'
        ].map(name => ({ $: 'number', name: name, max: 100 })),
    ]
}

let lib = {};
lib.randBetween = (min, max) => {
    return min + Math.floor(Math.random() * ((max - min) + 1));
}
lib.randomObject = name => {
    let o = {};
    for ( let prop of itemModel.properties ) {
        switch ( prop.$ ) {
            case 'string':
                continue;
            case 'choice':
                let i = Math.floor(Math.random() * prop.options.length);
                o[prop.name] = prop.options[i];
                continue;
            case 'number':
                let n = Math.floor(Math.random() * (prop.max + 1))
                o[prop.name] = n;
                continue;
        }
    }
    o.name = name;
    return o;
};
lib.foodObject = name => {
    let o = lib.randomObject(name);
    o.nutrition = lib.randBetween(60, 100);
    o.sharpness = Math.max(o.sharpness - 60, 0);
    o.hardness = Math.max(o.hardness - 60, 0);
    return o;
}
lib.metalObject = name => {
    let o = lib.randomObject(name);
    o.nutrition = Math.max(o.nutrition - 60, 0);
    o.sharpness = Math.min(o.sharpness + 30, 100);
    o.hardness = Math.min(o.hardness + 40, 100);
    o.weight = Math.min(o.weight + 40, 100);
    return o;
}
lib.weaponObject = name => {
    let o = lib.metalObject(name);
    o.magicness = Math.min(o.magicness + 30, 100);
    o.sharpness = Math.min(o.sharpness + 30, 100);
    o.aerodynamicness = Math.min(o.aerodynamicness + 20, 0);
    return o;
}

let items = [
    ...[
        'onion', 'apple', 'celery stick', 'bacon strip', 'egg',
        'meat pie',
    ].map(name => lib.foodObject(name)),
    ...[
        'sword', 'axe', 'knife', 'hammer', 'staff', 'throwing stars',
    ].map(name => lib.weaponObject(name)),
    ...[
        'amulet', 'key',
    ].map(name => lib.metalObject(name))
];

items.sort(() => Math.random());

lib.subjective = n => {
    let specific = [
        [0, 10, 'hardly'],
        [10, 25, 'a tiny bit'],
        [25, 30, 'a little'],
        [30, 45, 'somewhat'],
        [45, 55, 'half'],
        [55, 70, 'decently'],
        [70, 80, 'considerably'],
        [80, 90, 'extremely'],
        [90, 100, 'ultimately'],
    ];

    let descriptive = [
        [0, 40, 'not too'],
        [40, 70, 'medium'],
        [70, 100, 'quite'],
        [80, 100, 'very'],
    ];
    
    let range = [
        [0, 50, 'less than half'],
        [50, 100, 'at least half'],
        [10, 100, 'any'],
    ];
    
    let lists = [specific, descriptive, range];
    
    let adverbs = [];
    for ( let list of lists ) for ( let row of list ) {
        if ( n >= row[0] && n < row[1] ) adverbs.push(row[2]);
    }

    return adverbs;
};

lib.adverb = num => lib.subjective(num)[0];

lib.is = (o, qual, prop) => {
    return lib.subjective(o[prop]).includes(qual);
};

let funcs = {
    eat: o => {
        let healthDelta = 0;
        let nutritionDelta = 0;
        let msg = `You eat the ${o.name}. `
        let a = false;
        let b = false;
        if ( lib.is(o, 'very', 'hardness') ) {
            msg += `It's quite hard and unpleasant to eat. `;
            a = true;
        }
        if ( lib.is(o, 'very', 'sharpness') ) {
            healthDelta -= Math.floor(o.sharpness / 10.0);
            msg += `It's${a ? ' also' : ''} sharp! You lose ${-1*healthDelta} hp! `
            b = true;
        }
        if ( lib.is(o, 'quite', 'nutrition') ) {
            let adverb = lib.adverb(o.nutrition);
            msg += `${a || b ? (
                adverb == "ultimately" ? "Surprisingly, it's" : "At least it's"
            ) : "It's"} ${adverb} nutritious!`;
        }
        if ( lib.is(o, 'not too', 'nutrition') && ! b ) {
            msg += `It's not very nutritious; should you be eating this?`;
        }
        return msg;
    }
}

for ( let item of items ) {
    console.log(funcs.eat(item))
}