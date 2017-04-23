function Event(key, ...data) {
    data.key = key;
    return data;
}

module.exports = Event;