interface Role {
    say()
}

interface Role2 {
    say2()
}

class test implements Role, Role2 {
    say() {
        console.log('1')
    }
    say2() {
        console.log('2')
    }
}