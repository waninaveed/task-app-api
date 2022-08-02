const SibApiV3Sdk = require('sib-api-v3-sdk')
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey=process.env.SENDINBLUE_API_KEY

// new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
//     subject :'Hello from the task app',
//     sender :{
//         email: 'api@sendinblue.com',
//         name: 'Task App'
//     },
//     to: [{
//         name: 'Naveed Wani',
//         email: 'waninaveed21@gmail.com'
//     }],
//     htmlContent: '<html><body><h1>This is a transactional email {{params.bodyMessage}}</h1><p>lol, this is the body that you  need to see.</p></body></html>',
//     params: {
//         bodyMessage: 'Made just for you <3'
//     }
// }).then((data) => {
//     console.log(data)
// }).catch((error) => {
//     console.log(error)
// })
const sendWelcomeEmail = (email, name) => {
    new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
        subject: 'Welcome to the Task App',
        sender: {
            email: 'api@sendinblue.com',
            name: 'Task App'
        },
        to: [{
            name: 'Naveed Wani',
            email: 'waninaveed21@gmail.com'
        }],
        htmlContent: `<html><body><h1>Welcome to the Task App, ${name}</h1><p>Let us know if you need anyting by replying to this Email.</p></body></html>`,
        
    }).then((data) => {
        console.log(data)
    }).catch((error) => {
        console.log(error)
    })
}

const sendDeleteEmail = (email, name) => {
    new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
        subject: `Sorry to see you go, ${name}`,
        sender: {
            email: 'api@sendinblue.com',
            name: 'Task App'
        },
        to: [{
            name: 'Naveed Wani',
            email: 'waninaveed21@gmail.com'
        }],
        htmlContent: `<html><body><h1>Take Care, ${name}</h1><p>Let us know what went wrong.</p></body></html>`
    }).then((data) => {
        console.log(data)
    }).catch((error) => {
        console.log(error)
    })
}




module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}