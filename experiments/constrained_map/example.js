let items = [
    {
        id: 'bossKey',
    },
];

let keyLocations = [
    {
        id: 'entrance',
    },
    {
        id: 'bossRoom',
    },
];

let constraints = [
    {
        type: 'distance',
        from: {
            type: 'keyLocation',
            id: 'entrance',
        },
        to: {
            type: 'item',
            id: 'bossKey'
        },
        min: 4,
        max: 5,
    },
    {
        type: 'distance',
        from: {
            type: 'keyLocation',
            id: 'entrance',
        },
        to: {
            type: 'keyLocation',
            id: 'bossRoom'
        },
        min: 2,
        max: 3,
    },
]

let lib = {};
lib.pairType = con => {
    return [con.from.type, con.to.type].sort().join('-');
};
lib.makeRoom = id => {
    return {
        id: id,
        links: [null, null, null, null], // NESW
    }
};

let rooms = [];
for ( let loc of keyLocations ) {
    rooms.push(lib.makeRoom(loc.id));
}

for ( let con of constraints ) {
    if ( con.type == 'distance' ) {
        if ( lib.pairType(con) == 'keyLocation-keyLocation' ) {
            // rooms.find(o => o.id == con.from.id).links[1] = con.to.id;
            // rooms.find(o => o.id == con.to.id).links[3] = con.from.id;
        }
    }
}