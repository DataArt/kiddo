import console

x = console.get_value("x")
y = console.get_value("y")

if x >= 0:
    console.set_value("c", x + y)
else:
    console.set_value("c", x * y)