const uuidv1 = require('uuid/v1');
const nodemailer = require('nodemailer');

const emerg_title = '위험 상황 발생!';

let instance;
class EmergencyManager {
  constructor() {
    if(instance) return instance;

    this.timers = {};
    this.smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PW
      }
    });
    instance = this;
  }

  handleEmergency(contacts1, contacts2, cb) {
    const uuid1 = uuidv1();
    console.log('LOG: handleEmergency: ', contacts1, contacts2);
    
    const body = `현재 위험 상황이 발생하였습니다!!\r\n해당 주소로 접속하여 확인 해 주세요.\r\nhttp://52.231.67.172:8088/api/detect/${uuid1}\r\n`;
    instance.sendEmail(contacts1, emerg_title, body);

    instance.timers[uuid1] = {
      timer: setTimeout(instance.processEmergency, 20000, contacts2, uuid1),
      is_worked: false
    }
  }

  processEmergency(contacts, uuid){
    console.log('LOG: processEmergency: ', uuid);
    const body = `현재 아이가 위험 상황에 놓여있습니다!!\r\n해당 주소로 접속하여 확인 해 주세요.\r\n`;

    instance.timers[uuid].is_worked = true;
    instance.sendEmail(contacts, emerg_title, body);
  }

  sendEmail(contacts, title, body) {
    console.log('LOG: sendEmail: ', contacts);
    console.log('\ttitle: ', title);
    console.log('\tbody: ', body);
    contacts.forEach(i => {
      instance.smtpTransport.sendMail({
        from: 'no-reply-Busvisor <busvisor@gmail.com>',
        to: i.email,
        subject: title,
        text: body
      }).then(() => console.log('email tranfered!'))
        .catch(e => console.log(e))
    });
  }

  stopTimer(uuid) {
    return new Promise((resolve, reject) => {
      if(!this.timers[uuid])
        reject(new Error('Unavailable token value!'));
      else { 
        if(this.timers[uuid].is_worked)
          resolve(false);
        else {
          clearTimeout(this.timers[uuid].timer);
          resolve(true);
        }

        delete this.timers[uuid];
      }

    });
  }
}

module.exports = new EmergencyManager();
