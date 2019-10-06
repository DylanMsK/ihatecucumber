import time
funcs = [lambda x, n=n: x+n for n in range(5)]

for f in funcs:
    print(f(0))
    time.sleep(1)