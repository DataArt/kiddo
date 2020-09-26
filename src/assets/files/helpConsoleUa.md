<span style="color: #000;">Даний скрипт потрібно писати на мові Python. Якщо тобі незнайомі основи мови або тобі потрібно освіжити в пам’яті деяку інформацію, використовуй <a href="https://docs.python.org/3/tutorial/index.html" target="_blank" rel="nofollow">це посилання</a>.</span>

<span style="color: #000;">В залежності від завдання, рівень може генеруватися по-різному. При натисканні на кнопку "Перегенерувати рівень" отримуються різні варіанти початкових умов. Інколи рівень буде незмінним з одними і тими ж значеннями змінних.</span>

<span style="color: #000;">Для проходження рівня необхідно імпортувати модуль console, який використовується для роботи зі змінними консолі:</span>
```python
import console
```

<span style="color: #000;">Робота зі змінними консолі виконується наступними методами:</span>
* ```python
    console.get_value("name")
    ```
    <p style="color: #000;">Отримати значення змінної name</p>

* ```python
    console.set_value("name", value)
    ```
    <p style="color: #000;">Присвоїти значення value змінній name</p>

* ```python
    print()
    ```
    <p style="color: #000;">Надрукувати повідомлення або значення змінної в консоль</p>

#### <span style="color: #000;">Приклади</span> 
##### <span style="color: #000;">Завдання</span>
<p style="color: #000;">Скласти значення змінних A та B в змінну C та вивести це значення в консоль.</p>

##### <span style="color: #000;">Рішення</span>
```python
import console
sum = console.get_value('a') + console.get_value('b')
console.set_value("c", sum)
print console.get_value("c")
```