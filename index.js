var mraa = require('mraa');
var bleno = require('bleno');

var led = new mraa.Gpio(12);
led.dir(mraa.DIR_OUT);

var L_in1 = new mraa.Gpio(2);
var L_in2 = new mraa.Gpio(7);
var R_in1 = new mraa.Gpio(4);
var R_in2 = new mraa.Gpio(8);

L_in1.dir(mraa.DIR_OUT);
L_in2.dir(mraa.DIR_OUT);
R_in1.dir(mraa.DIR_OUT);
R_in2.dir(mraa.DIR_OUT);

function checkGPIO(){
  if(!L_in1){
    L_in1 = new mraa.Gpio(2);
	L_in1.dir(mraa.DIR_OUT);
	console.log("reset L_in1");
  }
  if(!L_in2){
    L_in2 = new mraa.Gpio(7);
	L_in2.dir(mraa.DIR_OUT);
	console.log("reset L_in2");
  }
  if(!R_in1){
    R_in1 = new mraa.Gpio(4);
	R_in1.dir(mraa.DIR_OUT);
	console.log("reset R_in1");
  }
  if(!R_in2){
    R_in2 = new mraa.Gpio(8);
	R_in2.dir(mraa.DIR_OUT);
	console.log("reset R_in2");
  }
}

bleno.on('stateChange', function(state){
  console.log('on -> stateChange: ' + state);
  if(state == 'poweredOn'){
    bleno.startAdvertising('Edison', ['B83BD1D01FB04A96A471E2300982C40A']);
  }else{
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error){
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if(!error){
    bleno.setServices([
      new bleno.PrimaryService({
        uuid: 'B83BD1D01FB04A96A471E2300982C40A',
        characteristics: [
          new bleno.Characteristic({
            uuid: 'B83BD1D01FB04A96A471E2300982C40B',
            properties: ['write', 'writeWithoutResponse'],
            onWriteRequest: function(data, offset, withoutResponse, callback){
			  console.log('write request: ' + data);
			  checkGPIO();
              if(data == 'forward'){
                L_in1.write(1);
                L_in2.write(0);
                R_in1.write(1);
                R_in2.write(0);
                console.log('forward');
              }else if(data == 'left'){
                L_in1.write(0);
                L_in2.write(1);
                R_in1.write(1);
                R_in2.write(0);
                console.log('left');
              }else if(data == 'right'){
                L_in1.write(1);
                L_in2.write(0);
                R_in1.write(0);
                R_in2.write(1);
                console.log('right');
              }else if(data == 'back'){
                L_in1.write(0);
                L_in2.write(1);
                R_in1.write(0);
                R_in2.write(1);
                console.log('back');
              }else if(data == 'stop'){
                L_in1.write(0);
                L_in2.write(0);
                R_in1.write(0);
                R_in2.write(0);
                console.log('stop');
              }else{
                console.log('unknown command');
              }
              callback(bleno.Characteristic.RESULT_SUCCESS);
            }
          }),
        ],
      })
    ])
  }
});

bleno.on('advertisingStop', function(){
  console.log('bleno on -> advertisingStop');
});

bleno.on('servicesSet', function(){
  console.log('bleno on -> servicesSet');
});
