'use strict';


class Person{
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    static sayHi(){
        console.log(this.gender);
    }
}

class Boy extends Person{
    constructor(name,age){
        super(name,age);
        this.gender = 'boy';
    }
}
Boy.gender = 'boy';

Person.sayHi();


