<p style="color: #000; font-weight: bold;">1. Փոփոխականը ավելացնել կոնսոլին:</p>

```javascript
this.addConsoleVariable('name', value, readOnly) 
```

<p style="color: #000;">որտեղ name - ը փոփոխական անվանման տող է</p>
<p style="color: #000;">value - տող, համար կամ js- գործառույթ, որը վերադարձնում է տողը / համարը</p>
<p style="color: #000;">readOnly-  բուլյան պարամետր է, որը ստանձնում  է true/false աժեքը: True արժեքը փոփոխականն անփոփոխ է դարձնում, false արժեքը`փոփոխական: Լռելյայն արժեքը false է:</p>
<p style="color: #000;">Փոփոխականների ավելացման առավելագույն քանակը 4 է:</p>
<p style="color: #000;">Փոփոխականի անվանման համար թույլատրվում է կիրառել «capital letters» և «block letters» տառերի ռեգիստրները: Եթե տառերի ռեգիստրները տարբեր են, ապա փոփոխականները տարբեր են համարվում:</p>
<p style="color: #000;">Փոփոխական արժեքը կարող է լինել դատարկ: Այս դեպքում null- ը պետք է փոխանցվի որպես value:</p>
<p style="color: #000;">Փոփոխականի թվային թույլատրելի արժեքների սահմանը -1 000 000-ից մինչև 1 000 000 է:.</p>
<p style="color: #000;">Օրինակներ՝</p>

```javascript
this.addConsoleVariable('STR', 'test', true);
this.addConsoleVariable('x', Math.floor((Math.random() * 10) + 1), true);
this.addConsoleVariable('Y', 10, false);
this.addConsoleVariable('c', null);
```

<p style="color: #000; font-weight: bold;">2. Ավելացնել ծածկագիր `առաջադրանքի կատարման ստուգման համար</p>

```javascript
this.addCheckingLogic('code') 
```

<p style="color: #000;">որտեղ code-ը JS կոդ է, որը վերադարձնում է null / undefined կամ տեքստի սխլով տող (օրինակ ՝ «Առաջադրանքը սխալ է կատարված»)</p>
<p style="color: #000;">Օրինակ ՝</p>

```javascript
this.addCheckingLogic(`
  return this.getConsoleVarValue('C') ===
    this.getConsoleVarValue('X') * this.getConsoleVarValue('Y')
    ? null
    : 'TASK_DONE_WRONG'
`);
```

<p style="color: #000; font-weight: bold;">Հաջորդ օրինակում ցուցադրված է պարզ դրվագի կազմաձևումը</p>

```javascript
this.addConsoleVariable('x', 10);
this.addCheckingLogic(`
  return this.consoleContent.includes('10') && this.getVariableValue('x') === 10
    ? null
    : 'TASK_DONE_WRONG'
`);
```
