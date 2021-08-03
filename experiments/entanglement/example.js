let lib = {};
lib.angularProbability = theta => Math.pow(Math.cos(theta * 0.5), 2);
lib.angleDiff = (a1, a2) => {
    let diff = (a1 - a2 + 2*Math.PI) % ( 2 * Math.PI );
    return Math.atan2(Math.sin(diff), Math.cos(diff));
};
lib.makeEntangledObjects = () => {
    let AngleMeasurable = function () {
        this.detangle = false;
        this.angle = null;
        this.measure = function(theta) {
            let p = 0.5;
            if ( this.angle !== null ) {
                let diff = lib.angleDiff(this.angle, theta);
                // console.log(diff / Math.PI);
                p = lib.angularProbability(diff);
            }
            let oppositeAngle = ( theta + Math.PI ) % ( 2 * Math.PI );
            if ( Math.random() < p ) {
                result = [theta, oppositeAngle, true];
            } else {
                result = [oppositeAngle, theta, false];
            }
            this.angle = result[0];
            if ( this.partner ) {
                this.partner.angle = result[1];
                if ( this.detangle ) this.partner = null;
            }
            return result[2];
        }
    };
    let a = new AngleMeasurable();
    let b = new AngleMeasurable();
    a.partner = b;
    b.partner = a;
    return { a: a, b: b };
};

let tests = [];
tests.push({
    name: '60 degrees should correspond to 3/4 probability',
    code: () => {
        let v = lib.angularProbability(Math.PI / 3.0);
        return Math.abs(v - 3.0 / 4.0) < Math.pow(10, -12);
    }
});

tests.push({
    name: '-60 degrees should correspond to 3/4 probability',
    code: () => {
        let v = lib.angularProbability(2 * Math.PI - Math.PI / 3.0);
        return Math.abs(v - 3.0 / 4.0) < Math.pow(10, -12);
    }
});

tests.push({
    name: '0 degrees should correspond to 100% probability',
    code: () => {
        let v = lib.angularProbability(0);
        return Math.abs(v - 1) < Math.pow(10, -12);
    }
});

tests.push({
    name: '180 degrees should correspond to 0% probability',
    code: () => {
        let v1 = lib.angularProbability(Math.PI);
        let v2 = lib.angularProbability(-1 * Math.PI);
        return Math.abs(v1) >= 0 && Math.abs(v1) < Math.pow(10, -12)
            && Math.abs(v2) >= 0 && Math.abs(v2) < Math.pow(10, -12);
    }
});

// /*
tests.push({
    name: 'Entangled object should have different result with same angle',
    code: () => {
        let { a, b } = lib.makeEntangledObjects();
        for ( let i = 0 ; i < 300 ; i++ ) {
            let theta = Math.random() * Math.PI * 2;
            if ( a.measure(theta) == b.measure(theta) ) return false;
        }
        return true;
    }
});
/**/

// /*
tests.push({
    name: 'Entangled object should have same result with opposite angle',
    code: () => {
        let { a, b } = lib.makeEntangledObjects();
        for ( let i = 0 ; i < 30 ; i++ ) {
            let theta1 = Math.random() * Math.PI * 2;
            let theta2 = ( theta1 + Math.PI ) % ( 2 * Math.PI );
            if ( a.measure(theta1) != b.measure(theta2) ) return false;
        }
        return true;
    }
});
/**/

// /*
tests.push({
    name: 'Bell Inequality',
    code: () => {
        let ITERS = [800, 30];
        let detectors = [0, Math.PI - Math.PI / 3.0, Math.PI + Math.PI / 3.0];
        let randomDetector = () => {
            return detectors[Math.floor(Math.random() * detectors.length)];
        };
        let averages = [];
        for ( let j = 0 ; j < ITERS[0] ; j++ ) {
            let different = 0;
            for ( let i = 0 ; i < ITERS[1] ; i++ ) {
                let { a, b } = lib.makeEntangledObjects();
                let resultA = a.measure(randomDetector());
                let resultB = b.measure(randomDetector());
                if ( resultA != resultB ) different++;
            }
            averages.push(different / ITERS[1]);
        }
        let average = averages.reduce((sum, v) => sum + v) / averages.length;
        console.log(`probability of different results: ${average}`);
        return Math.abs(0.5 - average) < Math.pow(10, -2);
    }
});
/**/

let runTests = () => {
    for ( let test of tests ) {
        console.log(`=== Test: ${test.name} ===`);
        if ( test.code() ) console.log('\033[32;1mPASS\033[0m');
        else console.log('\033[31;1mFAIL\033[0m');
    }
};

runTests();
