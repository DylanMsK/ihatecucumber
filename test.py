def test(a, b=None):
    if not b:
        print(f'b is {b}')
    else:
        print('yes')
test(1)
test(1, [])
test(1, 0)
test(1, '')