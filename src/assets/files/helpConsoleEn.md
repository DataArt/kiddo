<span style="color: #000;">This script is to be written in Python programming language. If you are not familiar with it or you or need to brush up on the basics, use <a href="https://docs.python.org/3/tutorial/index.html" target="_blank" rel="nofollow">this link</a>.</span>

<span style="color: #000;">Depending on the task, the level can be generated in different ways. Clicking on  "Regenerate Level" button, you get different options for the initial terms. Sometimes the level will be constant with the same variable values.</span>

<span style="color: #000;">To pass the level, you need to import the "console" module that is used to work with console variables:</span>
```python
import console
```

<span style="color: #000;">You can work with console variables using the following methods:</span>
* ```python
    console.get_value("name")
    ```
    <p style="color: #000;">Get the variable "name" value</p>

* ```python
    console.set_value("name", value)
    ```
    <p style="color: #000;">Specify the variable "name" value</p>

* ```python
    print()
    ```
    <p style="color: #000;">Print the specified message or variable value to the console screen</p>

#### <span style="color: #000;">Examples</span> 
##### <span style="color: #000;">Task</span>
<p style="color: #000;">Add the value of variables A and B to variable C and print this value to the console.</p>

##### <span style="color: #000;">Solution</span>
```python
import console
sum = console.get_value('a') + console.get_value('b')
console.set_value("c", sum)
print console.get_value("c")
```