
class Timer {
    getTime () {
        throw new Error("Not implemented");
    }
}

class RandomTimer extends Timer {
    getTime () {
        const MIN = 1000000;

        return ((Math.random() * 1500000) ^ 0) + MIN;
    }
}

module.exports = {
    Timer,
    RandomTimer
};