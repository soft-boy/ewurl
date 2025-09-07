// loosely based on Twitter Snowflake:
// https://developer.twitter.com/en/docs/twitter-ids
// https://blog.x.com/engineering/en_us/a/2010/announcing-snowflake
//
// 57 bits timestamp (milliseconds since custom epoch: no collisions for 1114 years)
// 3 bits machine id (8 machines)
// 4 bits sequence number (per machine: 16000 ids per second)
//
// Total: 64 bits = 8 bytes 

function get_timestamp() {
    return Date.now();
}

function get_machine_id() {
    return Number(process.env.MACHINE_ID);
}

let count = 0;
let lastTimestamp = Date.now();

function get_sequence_num() {
    const now = Date.now();
    if (now !== lastTimestamp) {
        count = 0;
        lastTimestamp = now;
    }
    count++;

    return count;
}

function get_unique_id() {
    const timestamp = get_timestamp() * (2 ** 7);
    const machine_id = get_machine_id() * (2 ** 4);
    const sequence_num = get_sequence_num();

    return timestamp + machine_id + sequence_num;
}

module.exports = {
    get_timestamp,
    get_machine_id,
    get_sequence_num,
    get_unique_id
};