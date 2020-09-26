import raccoon

raccoon.go_right()
raccoon.go_down(6)

objects_down = raccoon.inspect([-1, 1], [0, 1], [1, 1])
while (2 in objects_down):
    objects_down = raccoon.inspect([-1, 1], [0, 1], [1, 1])

raccoon.go_down(2)
raccoon.go_right(3)
raccoon.go_left(3)

objects_atop = raccoon.inspect([-1, -1], [0, -1], [1, -1])
while (2 in objects_atop):
    objects_atop = raccoon.inspect([-1, -1], [0, -1], [1, -1])

raccoon.go_up(3)
raccoon.go_right(2)
raccoon.go_up()

objects_right = raccoon.inspect([1, -1], [1, 0], [1, 1])
while (2 in objects_right):
    objects_right = raccoon.inspect([1, -1], [1, 0], [1, 1])

raccoon.go_right(3)
raccoon.go_down()
raccoon.go_right()
raccoon.go_down()

objects_down = raccoon.inspect([-1, 1], [0, 1], [1, 1])
while (2 in objects_down):
    objects_down = raccoon.inspect([-1, 1], [0, 1], [1, 1])

raccoon.go_down()
raccoon.go_right()