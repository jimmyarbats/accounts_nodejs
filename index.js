const fs = require('fs');

const chalk = require('chalk');
const inquirer = require('inquirer');

operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Bem-vindo ao sistema de gerenciamento de contas, qual serviço você deseja consultar?',
            choices: [
                'Criar uma nova conta',
                'Consultar seu saldo',
                'Realizar um deposito',
                'Realizar um saque',
                'Sair do sistema'
            ],
        },
    ])
    .then((answer) => {
        const action = answer['action']
        console.log(action);
    })
    .catch((err) => console.log(err))
}