import math
r = 99
p = 397
q = 191

n = p * q
f = 75240

def generate_key() -> dict[str,tuple]:
    p = 7
    q = 5
    n = p * q
    n_2 = n ** 2
    lcm = math.lcm(p-1,q-1)
    gcd = math.gcd(n,(p - 1) * (q - 1))
    print(f'{lcm}-{gcd}')
    y = 3
    x = (((y ** lcm) % n_2 - 1) // n) % n
    print(x)
    print(f'public: ({y}:{n})\nprivate: ({lcm}:{x})')
    return {'pub_y': y, 'pub_n': n, 'sec_a': lcm, 'sec_x': x}
    #return {'public': (y,n), 'private': (lcm,x)}

if __name__ == '__main__':
    p = 7
    q = 5
    n = p * q
    n_2 = n ** 2
    lcm = math.lcm(p-1,q-1)
    gcd = math.gcd(n,(p - 1) * (q - 1))
    print(f'{lcm}-{gcd}')
    y = 3
    x = (((y ** lcm) % n_2 - 1) // n) % n
    print(x)
    print(f'public: ({y}:{n})\nprivate: ({lcm}:{x})')

