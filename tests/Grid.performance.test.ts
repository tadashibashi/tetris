// const TEST_LEN = 1_000_000;
// const uint8s = new Float64Array(TEST_LEN);
// const nums = new Array<number>(TEST_LEN);
//
// let now;
// // now = performance.now();
// // for(let num of uint8s);
// // console.log("Uint8Array for in:", performance.now() - now);
//
// now = performance.now();
// for(let i = 0; i < uint8s.length; ++i) {
//     uint8s[i] = i;
// }
// console.log("Uint8Array for assignment:", performance.now() - now);
//
// now = performance.now();
// for (let num of nums);
// console.log("Array<number> for in:", performance.now() - now);
//
// now = performance.now();
// for (let i = 0; i < nums.length; ++i) {
//     nums[i] = i;
// }
// console.log("Array<number> for assignment", performance.now() - now);

test("contiguous memory copy within outperforms array copy", () => {
    const a = new Uint32Array(1000);
    const b = new Array<number>(1000);

    const TEST_ITERS = 1_000_000;

    let now = performance.now();
    for (let i = 0; i < TEST_ITERS; ++i)
        a.copyWithin(100, 0, 900);

    const aTime = performance.now() - now;
    console.log("Uint32Array internal copy time:", aTime, "ms");

    now = performance.now();
    const buffer = new Array<number>(900);
    for (let i = 0; i < TEST_ITERS; ++i) {
        for (let j = 0; j < 900; ++j) {
            buffer[j] = b[j];
        }
        for (let j = 0; j < 900; ++j) {
            b[j + 100] = buffer[j];
        }
    }

    const bTime = performance.now() - now;
    console.log("Regular Array internal copy time:", bTime, "ms");
    expect(aTime < bTime);
});



