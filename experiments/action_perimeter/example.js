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
lib.randomObject = name => {
    let o = {};
    for ( let prop of itemModel.properties ) {
        switch ( prop.$ ) {
            case 'string':
                continue;
            case 'choice':
                let i = Math.floor(Math.random() * prop.options.length);
                o[prop.name] = prop.options[i];
            case 'number':
                let n = Math.floor(Math.random() * prop.max) + 1
                o[prop.name] = n;
        }
    }
    o.name = name;
    return o;
};
lib.foodObject = name => {
    let o = lib.randomObject(name);
    o.nutrition = Math.min(o.nutrition + 50, 100);
    o.sharpness = Math.max(o.sharpness - 30, 0);
    return o;
}
lib.metalObject = name => {
    let o = lib.randomObject(name);
    o.nutrition = Math.max(o.nutrition - 60, 0);
    o.sharpness = Math.min(o.sharpness + 40, 0);
    o.hardness = Math.min(o.hardness + 40, 0);
    o.weight = Math.min(o.weight + 40, 0);
    return o;
}
lib.weaponObject = name => {
    let o = lib.metalObject(name);
    o.magicness = Math.min(o.magicness + 30, 0);
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

lib.subjective = num =>
    num < 10 ? ['hardly', 'not too', 'less than half'] :
    num < 25 ? ['a tiny bit', 'not too', 'less than half', 'any'] :
    num < 30 ? ['a little', 'not too', 'less than half', 'any'] :
    num < 50 ? ['somewhat', 'less than half', 'any'] :
    num < 60 ? ['half', 'more than half', 'any'] :
    num < 70 ? ['decently', 'more than half', 'any'] :
    num < 80 ? ['considerably', 'more than half', 'very', 'any'] :
    num < 90 ? ['extremely', 'more than half', 'very', 'any'] :
    ['ultimately', 'more than half', 'very', 'any'];

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
        if ( lib.is(o, 'very', 'nutrition') ) {
            msg += `${a || b ? "At least it's" : "It's"} very nutritious!`;
        }
        if ( lib.is(o, 'not too', 'nutrition') ) {
            msg += `It's not very nutritious; should you be eating this?`;
        }
        return msg;
    }
}

for ( let item of items ) {
    console.log(funcs.eat(item))
}