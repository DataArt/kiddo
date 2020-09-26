<span style="color: #000;">This script is to be written in Python programming language. If you are not familiar with it or you or need to brush up on the basics, use <a href="https://docs.python.org/3/tutorial/index.html" target="_blank" rel="nofollow">this link</a>.</span>

<span style="color: #000;">Depending on the task, the level can be generated in different ways. Clicking on  "Regenerate the level" button, you get different options for the initial terms. Sometimes the level will be constant with the same initial terms.</span>

<span style="color: #000;">To pass the level, you need to import the "raccoon" module that is used to control the raccoon:</span>
```python
import raccoon
```

<span style="color: #000;">The raccoon is controlled as following:</span>
* ```python
    raccoon.go_left(n)
    ```
    <p style="color: #000;">Move "n" cells to the left. The default value is 1.</p>

* ```python
    raccoon.go_right(n)
    ```
    <p style="color: #000;">Move "n" cells to the right. The default value is 1.</p>

* ```python
    raccoon.go_up(n)
    ```
    <p style="color: #000;">Move "n" cells upwards. The default value is 1.</p>

* ```python
    raccoon.go_down(n)
    ```
    <p style="color: #000;">Move "n" cells down. The default value is 1.</p>

* ```python
    raccoon.wait(n)
    ```
    <p style="color: #000;">Wait for "n" turns. The default value is 1. The maximum allowed value is 100.</p>
    
* ```python
    raccoon.inspect
    ```
    <p style="color: #000;">There are two ways to invoke a method:</p>

    ```python
    raccoon.inspect(X, Y)
    ```
    <p style="color: #000;">This returns the only number depending on what follows in the specified direction.</p>

    ```python
    raccoon.inspect([X1, Y1], [X2, Y2], [X3, Y3], ...) 
    ```
    <p style="color: #000;">This returns the array of numbers containing as many of them as there are cells to check and depending on what follows in the specified direction.</p>
    <p style="color: #000;">
    Return values:<br>
    0 - rough terrain<br>
    1 - road<br>
    2 - monster<br>
    3 - cookie<br>
    4 - maze way-out<br>
    </p>
    <p style="color: #000;">Method parameters: X is the number indicating the horizontal deviation relative to the raccoon's position, Y is a vertical deviation. <strong style="color: #000;">Parameter values can only be numbers -1, 0 or 1</strong>.
Coordinates are counted <strong style="color: #000;">from left to right (X)</strong> and <strong style="color: #000;">from the top down (Y)</strong>. For example, the coordinate (1, -1) relative to the raccoon is located in the upper right.</p>

* ```python
    raccoon.set_mine()
    ```
    <p style="color: #000;">Places a mine on the cell the raccoon is currently in. The mine is activated after being hit by a monster.</p>

* ```python
    raccoon.place_turret()
    ```
    <p style="color: #000;">Activates the turret on the cell the raccoon is currently in. The turret shoots at monsters that are one cell away from it.</p>

<p style="color: #000;">Each of the above mentioned methods takes 1 game turn.</p>

<p style="color: #000;">Depending on the task, there may be gates and keys of different colors on the game field. An attempt to pass through the gate without a matching color key ends in failure. One key can open several gates of the same color.</p>

#### <span style="color: #000;">Example 1</span>
<span style="color: #000;">The following code will move the raccoon two cells to the right and one cell up:</span>
```python
import raccoon

raccoon.go_right(2)
raccoon.go_up()
```

#### <span style="color: #000;">Example 2</span>
<span style="color: #000;">This code verifies if there is a cookie in the cell on the raccoon’s left: raccoon.inspect(-1, 0) == 3. When this condition is met, the raccoon moves one cell left:</span>
```python
import raccoon

if raccoon.inspect(-1, 0) == 3:
    raccoon.go_left()
```

#### <span style="color: #000;">Example 3</span>
<span style="color: #000;">This code verifies if there are no monsters down ([1 , 1]) and up ([1, -1]) on the raccoon’s right: raccoon.inspect([1, 1], [1, -1]). When this condition is met, the raccoon moves one cell right or waits otherwise:</span>
```python
import raccoon

objects_around = raccoon.inspect([1, 1], [1, -1])
if (objects_around[0] != 2
    and objects_around[1] != 2):
        raccoon.go_right()
else:
    raccoon.wait()
    ...
```