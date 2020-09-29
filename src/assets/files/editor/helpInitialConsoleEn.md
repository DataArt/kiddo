<p style="color: #000; font-weight: bold;">1.	Adding a variable into the console</p>

```javascript
this.addConsoleVariable('name', value, readOnly) 
```

<p style="color: #000;">where “name” is a string with the variable name</p>
<p style="color: #000;">value is a string, number or js function that returns a string/number</p>
<p style="color: #000;">readOnly is a logic parameter taking the value of true/false. The value “true” makes the variable unchangeable while “false” makes it changeable. By default, the parameter value is equal to “false”.</p>
<p style="color: #000;">The admissible maximum number of the added variables is equal to 4. </p>
<p style="color: #000;">Both capital letters and block letters registers are permitted for the variable name. Variables introduced in different registers are considered different.</p>
<p style="color: #000;">The variable value can be empty. In such a case, “null” must be passed as the value.</p>
<p style="color: #000;">The admissible digital values range is from -1 000 000 up to 1 000 000.</p>
<p style="color: #000;">For example:</p>

```javascript
this.addConsoleVariable('STR', 'test', true);
this.addConsoleVariable('x', Math.floor((Math.random() * 10) + 1), true);
this.addConsoleVariable('Y', 10, false);
this.addConsoleVariable('c', null);
```

<p style="color: #000; font-weight: bold;">2.	Adding the checking logic code</p>

```javascript
this.addCheckingLogic('code') 
```

<p style="color: #000;">where code is JS code that returns null/unidentified or an error text string (for example, “Task Done Wrong)</p>
<p style="color: #000;">For example:</p>

```javascript
this.addCheckingLogic(`
  return this.getConsoleVarValue('C') ===
    this.getConsoleVarValue('X') * this.getConsoleVarValue('Y')
    ? null
    : 'TASK_DONE_WRONG'
`);
```

<p style="color: #000;">The following example shows a simple scene's configuration:</p>

```javascript
this.addConsoleVariable('x', 10);
this.addCheckingLogic(`
  return this.consoleContent.includes('10') && this.getVariableValue('x') === 10
    ? null
    : 'TASK_DONE_WRONG'
`);
```
