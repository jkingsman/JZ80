// count by twos at 0x10
// 0000   3E 04                  LD   A,$04
// 0002   32 10 00               LD   ($0010),A
// 0005   3A 10 00               LD   A,($0010)
// 0008   3C                     INC   A
// 0009   3C                     INC   A
// 000A   32 10 00               LD   ($0010),A
// 000D   18 F6                  JR   $5
let twos = [
    0x3E, 0x00,         // LD   A,$04
    0x32, 0x10, 0x00,   // LD   ($0010),A
    0x3A, 0x10, 0x00,   // LD   A,($0010)
    0x3C,               // INC   A
    0x3C,               // INC   A
    0x32, 0x10, 0x00,   // LD   ($0010),A
    0x18, 0xF6          // JR   $5
];

// put the nth fibonacci number (n @ $0100) at $0110
// 0000                             ; nth fibonacci number
// 0000                             ; n is stored at ($0100)
// 0000                             ; result stored at ($0110)
// 0000                             ; working mem > ($0200)
// 0000                             ; preload; should be set by hand
// 0000   11 0A 00               LD   DE,$000A
// 0003   ED 53 00 01            LD   ($0100),DE
// 0007                             ;
// 0007                             ; load loop val into B for easy DJNZ
// 0007   3A 00 01               LD   A,($0100)
// 000A   47                     LD   B,A
// 000B                             ;
// 000B                             ; Working (will always keep the latest fib @ ($0210))
// 000B                             ;
// 000B                LOADZERO:
// 000B   11 00 00               LD   DE,$0
// 000E   ED 53 10 02            LD   ($0210),DE
// 0012   10 02                  DJNZ   LOADONE
// 0014   18 23                  JR   EXIT
// 0016                             ;
// 0016                LOADONE:
// 0016                             ; save zero to low position
// 0016   ED 53 18 02            LD   ($0218),DE
// 001A                             ; save one to high position
// 001A   11 01 00               LD   DE,$1
// 001D   ED 53 10 02            LD   ($0210),DE
// 0021   10 02                  DJNZ   MAINLOOP
// 0023   18 14                  JR   EXIT
// 0025                             ;
// 0025                             ; MAIN LOOP
// 0025                MAINLOOP:
// 0025                             ; swap high and low positions
// 0025   ED 5B 10 02            LD   DE,($0210)
// 0029   2A 18 02               LD   HL,($0218)
// 002C   22 10 02               LD   ($0210),HL
// 002F   ED 53 18 02            LD   ($0218),DE
// 0033                             ;
// 0033                             ; add and store new to high posn
// 0033   19                     ADD   HL,DE
// 0034   22 10 02               LD   ($0210),HL
// 0037   10 EC                  DJNZ   MAINLOOP
// 0039                             ;
// 0039                EXIT:
// 0039                             ; exit condition -- place highest working fib into result location
// 0039   ED 5B 10 02            LD   DE,($0210)
// 003D   ED 53 10 01            LD   ($0110),DE
// 0041   76                     HALT

let fibonacci = [
    // load counter into B
    0x3A, 0x00, 0x01,         // LD   A,($0100)
    0x47,                     // LD   B,A

    // set zero
    0x11, 0x00, 0x00,         // LD   DE,$0
    0xED, 0x53, 0x10, 0x02,   // LD   ($0210),DE
    0x10, 0x02,               // DJNZ LOADONE
    0x18, 0x23,               // JR   EXIT

    // move hi to lo and set one
    0xED, 0x53, 0x18, 0x02,   // LD   ($0218),DE
    0x11, 0x01, 0x00,         // LD   DE,$1
    0xED, 0x53, 0x10, 0x02,   // LD   ($0210),DE
    0x10, 0x02,               // DJNZ MAINLOOP
    0x18, 0x14,               // JR   EXIT

    // main loop
    // swap hi/lo
    0xED, 0x5B, 0x10, 0x02,   // LD   DE,($0210)
    0x2A, 0x18, 0x02,         // LD   HL,($0218)
    0x22, 0x10, 0x02,         // LD   ($0210),HL
    0xED, 0x53, 0x18, 0x02,   // LD   ($0218),DE

    // sum and store to hi
    0x19,                     // ADD  HL,DE
    0x22, 0x10, 0x02,         // LD   ($0210),HL
    0x10, 0xEC,               // DJNZ MAINLOOP

    // exit -- load high to result and quit
    0xED, 0x5B, 0x10, 0x02,   // LD   DE,($0210)
    0xED, 0x53, 0x10, 0x01,   // LD   ($0110),DE
    0x76                      // HALT
];
