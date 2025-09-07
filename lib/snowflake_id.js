// loosely based on Twitter Snowflake:
// https://developer.twitter.com/en/docs/twitter-ids
// https://blog.x.com/engineering/en_us/a/2010/announcing-snowflake
//
// 41 bits timestamp (milliseconds since 2025-09-07)
// 3 bits machine id (8 machines)
// 3 bits sequence number (per machine: 8000 ids per second)

const CURRENT_EPOCH = 1757288226868; // 2025-09-07

function get_timestamp() {
    return Date.now() - CURRENT_EPOCH;
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
    const timestamp = get_timestamp() * (2 ** 6);
    const machine_id = get_machine_id() * (2 ** 3);
    const sequence_num = get_sequence_num();

    return timestamp + machine_id + sequence_num;
}

module.exports = {
    get_timestamp,
    get_machine_id,
    get_sequence_num,
    get_unique_id
};