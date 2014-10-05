var shell    = require('shelljs'),
    mandrill = require('mandrill-api/mandrill'),
    cfg      = require('./config.js');


var mandrill_client = new mandrill.Mandrill(cfg.mandrill.apikey);
var now             = new Date().getTime();
var bkupCmd         = '';


// Build Bkup command
bkupCmd = 'mysqldump -u ' + cfg.mysql.username + ' -p' + cfg.mysql.password + ' ';
bkupCmd += cfg.mysql.databases.join(' ');
bkupCmd += ' > superdump_' + now + '.' + 'sql';


shell.exec(bkupCmd, function(code, op) {
    if (code === 0) {
        sendEmail(true, 'DB backup was Successful');
    } else {
        return sendEmail(false, op);
    }
});


// Send Email
function sendEmail(status, msg) {
    var message = {
        "text"       : msg,
        "subject"    : status ? 'Successful' : 'Failure' + ' - ProjectHeena DB Backup',
        "from_email" : cfg.email.from,
        "to"         : cfg.email.to
    };

    mandrill_client.messages.send({
        "message" : message,
        "async"   : false
    }, function(result) {
        console.log(result);
    }, function(e) {
        console.log(e);
    });
}