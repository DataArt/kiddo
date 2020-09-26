import raccoon

direction = 'right'

def turn_left():
    if direction == 'right':
        return 'up'
    if direction == 'up':
        return 'left'
    if direction == 'left':
        return 'down'
    if direction == 'down':
        return 'right'

def turn_right():
    if direction == 'right':
        return 'down'
    if direction == 'down':
        return 'left'
    if direction == 'left':
        return 'up'
    if direction == 'up':
        return 'right'

def inspect_right():
    if direction == 'right':
        return raccoon.inspect(0, 1)
    if direction == 'down':
        return raccoon.inspect(-1, 0)
    if direction == 'left':
        return raccoon.inspect(0, -1)
    if direction == 'up':
        return raccoon.inspect(1, 0)

def inspect_forward():
    if direction == 'right':
        return raccoon.inspect(1, 0)
    if direction == 'down':
        return raccoon.inspect(0, 1)
    if direction == 'left':
        return raccoon.inspect(-1, 0)
    if direction == 'up':
        return raccoon.inspect(0, -1)

def go_forward():
    if direction == 'right':
        raccoon.go_right()
    if direction == 'down':
        raccoon.go_down()
    if direction == 'left':
        raccoon.go_left()
    if direction == 'up':
        raccoon.go_up()

objects_around = raccoon.inspect([1, 0], [0, 1], [-1, 0], [0, -1])

while (4 not in objects_around):
    if inspect_right() == 0 and inspect_forward() != 0:
        go_forward()
    if inspect_right() == 0 and inspect_forward() == 0:
        direction = turn_left()
        if inspect_forward() != 0:
            go_forward()
    if inspect_right() != 0:
        direction = turn_right()
        if inspect_forward() != 0:
            go_forward()
    objects_around = raccoon.inspect([1, 0], [0, 1], [-1, 0], [0, -1])

if objects_around[0] == 4:
    raccoon.go_right()
elif objects_around[1] == 4:
    raccoon.go_down()
elif objects_around[2] == 4:
    raccoon.go_left()
elif objects_around[3] == 4:
    raccoon.go_up()