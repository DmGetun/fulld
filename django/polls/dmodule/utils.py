import time

def is_prime(n: int) -> bool:
    if n == 2: return True
    
    if n % 2 == 0: return False

    vdel = 3
    while vdel * vdel <= n:
        if n % vdel == 0:
            return False
        vdel += 2
    
    return True

if __name__ == '__main__':
    start_time = time.time()
    n = 35742549198872617291353508656626642567
    print(hex(n))
    print(is_prime(n))
    print(f'time: {start_time - time.time()}')