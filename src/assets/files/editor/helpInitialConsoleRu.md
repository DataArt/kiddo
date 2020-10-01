<p style="color: #000;">Для конфигурации сцены есть следующие методы:</p>
<p style="color: #000; font-weight: bold;">1. Добавить переменную в консоль.</p>

```javascript
this.addConsoleVariable('name', value, readOnly) 
```

<p style="color: #000;">где name — строка-название переменной</p>
<p style="color: #000;">value — строка, число или JS функция, возвращающая строку/число</p>
<p style="color: #000;">readOnly — логический параметр, принимающий значение true/false. Значение true делает переменную неизменяемой, false — изменяемой. По умолчанию значение параметра равно false.</p>
<p style="color: #000;">Максимальное количество добавляемых переменных равно 4. </p>
<p style="color: #000;">Для имени переменной допустим верхний и нижний регистр букв. Если регистры букв отличаются, то переменные считаются разными.</p>
<p style="color: #000;">Значение переменной может быть пустым. В этом случае в качестве value необходимо передать null.</p>
<p style="color: #000;">Допустимый диапазон цифрового значения переменной от -1 000 000 до 1 000 000.</p>
<p style="color: #000;">Примеры:</p>

```javascript
this.addConsoleVariable('STR', 'test', true);
this.addConsoleVariable('x', Math.floor((Math.random() * 10) + 1), true);
this.addConsoleVariable('Y', 10, false);
this.addConsoleVariable('c', null);
```

<p style="color: #000; font-weight: bold;">2.	Добавить код проверки выполнения задания </p>

```javascript
this.addCheckingLogic('code') 
```

<p style="color: #000;">где code — JS код, который возвращает null/undefined или строку с текстом ошибки (например, “Задание выполнено неверно”)</p>
<p style="color: #000;">Пример:</p>

```javascript
this.addCheckingLogic(`
  return this.getConsoleVarValue('C') ===
    this.getConsoleVarValue('X') * this.getConsoleVarValue('Y')
    ? null
    : 'TASK_DONE_WRONG'
`);
```

<p style="color: #000; font-weight: bold;">Пример конфига простой сценки:</p>

```javascript
this.addConsoleVariable('x', 10);
this.addCheckingLogic(`
  return this.consoleContent.includes('10') && this.getVariableValue('x') === 10
    ? null
    : 'TASK_DONE_WRONG'
`);
```
