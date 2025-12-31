## Command Example

The command follows a fixed format:

**Header:** `0xFF 0x00`  
**Command Byte:** `0xA0` (indicates modifying the data upload period)  
**Data Bytes:** Example `0x012C` (sets period to 300 seconds)  
**Checksum:** Last two bytes use Modbus CRC with low-byte-first (big-endian mode)

## CRC Verification

### Calculation Steps:
1. Initialize CRC register to `0xFFFF`
2. XOR first 8-bit data byte with low byte of register
3. Right-shift register one bit, padding high bit with 0
4. Check shifted-out bit:
   - If `0`: repeat step 3
   - If `1`: XOR register with polynomial `0xA001`
5. Repeat steps 3-4 for all 8 bits
6. Repeat steps 2-5 for each subsequent byte
7. Swap high/low bytes of final 16-bit CRC register

## C Sample Code

```c
#include <stdio.h>

int main(void) {
    // Tx:000000-01 03 00 00 00 0A C5 CD
    unsigned short tmp = 0xffff;
    unsigned short val = 0;
    unsigned char buff[6] = {0};
    
    buff[0] = 0x01;
    buff[1] = 0x03;
    buff[2] = 0x00;
    buff[3] = 0x00;
    buff[4] = 0x00;
    buff[5] = 0x0A;
    
    for (int n = 0; n < 6; n++) {
        tmp = buff[n] ^ tmp;
        printf("XOR result: %x\n", tmp);
        
        for (int i = 0; i < 8; i++) {  /* Process 8 bits per char */
            printf("Iteration: %d\t\tLSB: %d", i * n, tmp & 0x01);
            printf("\tCurrent tmp: %x\n", tmp);
            
            if (tmp & 0x01) {
                tmp = tmp >> 1;
                tmp = tmp ^ 0xa001;
            } else {
                tmp = tmp >> 1;
            }
        }
        printf("CRC after processing data %d: %x\n", n, tmp);
    }
    
    /* Swap CRC bytes */
    val = tmp >> 8;
    val = val | (tmp << 8);
    printf("After swapping: %X\n", val);
    
    return 0;
}
```

}
