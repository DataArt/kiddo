import raccoon

def move_to(to, steps):
    if to == 'right':
        raccoon.go_right(steps)
    elif to == 'left':
        raccoon.go_left(steps)
    elif to == 'up':
        raccoon.go_up(steps)
    elif to == 'down':
        raccoon.go_down(steps)
    else:
        raccoon.wait(steps)

def go_like_serpent(first_move, second_move):
    raccoon.wait(6)
    move_to(first_move, 1)
    move_to(second_move, 2)
    move_to(first_move, 1)

go_like_serpent('right', 'up')
go_like_serpent('left', 'up')
go_like_serpent('up', 'right')
go_like_serpent('down', 'right')
go_like_serpent('down', 'right')
go_like_serpent('down', 'left')
go_like_serpent('down', 'left')