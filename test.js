{function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = sayName
 }
 var sayName = function() { alert(this.name) } 
 var person1 = new Person('Zaxlct', 28, 'Software Engineer');
 var person2 = new Person('Mick', 23, 'Doctor');
 console.log(person1.sayName === person2.sayName)
 person1.sayName()
 person2.sayName();
}