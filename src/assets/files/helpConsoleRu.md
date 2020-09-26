<span style="color: #000;">Этот скрипт нужно писать на языке Python. Если тебе незнакомы основы языка или тебе нужно освежить память, используй <a href="https://docs.python.org/3/tutorial/index.html" target="_blank" rel="nofollow">эту ссылку</a>.</span>

<span style="color: #000;">В зависимости от задачи, уровень может генерироваться по-разному. При нажатии на кнопку "Перегенерировать уровень" получаются разные варианты первоначальных условий. Иногда уровень будет постоянным с одними и теми же значениями переменных.</span>

<span style="color: #000;">Для прохождения уровня необходимо импортировать модуль console, который используется для работы с переменными консоли:</span>
```python
import console
```

<span style="color: #000;">Работа с переменными консоли выполняется следующими методами:</span>
* ```python
    console.get_value("name")
    ```
    <p style="color: #000;">Получить значение переменной name</p>

* ```python
    console.set_value("name", value)
    ```
    <p style="color: #000;">Присвоить значение value переменной name</p>

* ```python
    print()
    ```
    <p style="color: #000;">Напечатать сообщение или значение переменной в консоль</p>

#### <span style="color: #000;">Примеры</span> 
##### <span style="color: #000;">Задание</span>
<p style="color: #000;">Сложить значение переменных A и B в переменную C и вывести это значение в консоль.</p>

##### <span style="color: #000;">Решение</span>
```python
import console
sum = console.get_value('a') + console.get_value('b')
console.set_value("c", sum)
print console.get_value("c")
```