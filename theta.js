var fs = require('fs');
var ThetaSOscClient = require('osc-client-theta_s').ThetaSOscClient;
var readline = require('readline');
var Emitter = require('events').EventEmitter;

var domain = '192.168.1.1';
var port = '80';
var camera = new ThetaSOscClient();
var sessionId;
var filename;
var dir = '../output/';
var modality;
var iso;
var shutterSpeed;
var whiteBalance;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var startHandler = new Emitter();
var emitters = [];
var n; 

function removeSpace(string)
{
  if (string.substring(string.length-1) == " ") 
  {
    string = string.substring(0,string.length-1);
  }
  return string;
}

function pictureNumber(){
  rl.question('How many pictures? ',(num) => {
    n = num - 1;
    for (var i = 0; i <= n; i++) 
    {
      emitters[i] = new Emitter();
    }
    generalMode();
  });
}
function pathSettings () {
  rl.question('\n' + 'Path to save pictures: ',(path) => {
    var pathNoSpace = removeSpace(path);
    if (pathNoSpace)
    {
      if (!fs.existsSync(pathNoSpace))
      {
        fs.mkdirSync(pathNoSpace);
      }
      dir = pathNoSpace;
    }
    else
    {
      console.log('Using default path');
    }
    rl.close();
    run();
  });
}

function generalMode () {
  rl.question('\n' + 'Mode: (default: Normal)' + '\n' + '1: HDR' + '\n' + '2: Normal' + '\n' + 'Your choice: ',(mode) => {
    if (mode) {
      if (mode == '1') 
      {
        modality = {"hdr":true};
        console.log('(HDR mode)');
      }
      else if (mode == '2')
      {
        modality = {"hdr":false};
        console.log('(Normal mode)');
      }
    }
    else
    {
      console.log('(Normal)');
      modality = {"hdr":false};
    }
    defaultSettings();
  });
}

function defaultSettings () {
  rl.question('\n' + 'Use default settings? (y/n): (default: y)',(ris) => {
    if (!ris || ris == "y") 
    {
      iso = {"isoBalance":[]};
      shutterSpeed = {"shutterSpeed":[]};
      whiteBalance = {"whiteBalance":"auto"};
      console.log('(settings: auto)');
      pathSettings();
    } else if (ris == "n")
    {
      console.log('Customize your settings!');
      settings();
    }
  });
}

function settings(){
    rl.question('\n' + 'Iso mode: (default: auto)' + '\n' + '1: 100' + '\n' + '2: 200' + '\n' + '3: 400' + '\n' + '4: 800' + '\n' + '5: 1600' + '\n' + 'Your choice: ',(isonum) => {
      if (isonum == 1) {
        iso = {"isoBalance":[100]};
        console.log('(iso: 100)');
      } else if (isonum == 2) {
        iso = {"isoBalance":[200]};
        console.log('(iso: 200)');
      } else if (isonum == 3) {
        iso = {"isoBalance":[400]};
        console.log('(iso: 400)');
      } else if (isonum == 4) {
        iso = {"isoBalance":[800]};
        console.log('(iso: 800)');
      } else if (isonum == 5) {
        iso = {"isoBalance":[1600]};
        console.log('(iso: 1600)');
      } else if (isonum == null) {
        iso = {"isoBalance":[]};
        console.log('(iso: auto)');
      }
      shutterSpeedSettings();
    });

  function shutterSpeedSettings () {
    rl.question('\n' + 'Shutter speed (default: auto)' + '\n' + '1: 0.008' + '\n' + '2: 0.017' + '\n' + '3: 0.033' + '\n' + '4: 0.067' + '\n' + 'Your choice: ',(speed) => {
      if (speed == 1) {
        shutterSpeed = {"shutterSpeed":[0.008]};
        console.log('(shutterSpeed: 0.008)');
      } else if (speed == 2) {
        shutterSpeed = {"shutterSpeed":[0.017]};
        console.log('(shutterSpeed: 0.017)');
      } else if (speed == 3) {
        shutterSpeed = {"shutterSpeed":[0.033]};
        console.log('(shutterSpeed: 0.033)');
      } else if (speed == 4) {
        shutterSpeed = {"shutterSpeed":[0.067]};
        console.log('(shutterSpeed: 0.067)');
      } else if (speed == null) {
        shutterSpeed = {"shutterSpeed":[]};
        console.log('(shutterSpeed: auto)');
      }
      whiteBalanceSettings();
    });
  }

  function whiteBalanceSettings () {
    rl.question('\n' + 'White balance (default: auto)' + '\n' + '1: incandescent' + '\n' + '2: fluorescent' + '\n' + '3: datalight' + '\n' + '4: cloudy-daylight' + '\n' + '5: shade' + '\n' + '6: twilight' + '\n' + 'Your choice: ',(wBalance) => {
      if (wBalance == 1) {
        whiteBalance = {"whiteBalance":"incandescent"};
        console.log('(whiteBalance: incandescent)');
      } else if (wBalance == 2) {
        whiteBalance = {"whiteBalance":"fluorescent"};
        console.log('(whiteBalance: fluorescent)');
      } else if (wBalance == 3) {
        whiteBalance = {"whiteBalance":"datalight"};
        console.log('(whiteBalance: datalight)');
      } else if (wBalance == 4) {
        whiteBalance = {"whiteBalance":"cloudy-daylight"};
        console.log('(whiteBalance: cloudy-daylight)');
      } else if (wBalance == 5) {
        whiteBalance = {"whiteBalance":"shade"};
        console.log('(whiteBalance: shade)');
      } else if (wBalance == 6) {
        whiteBalance = {"whiteBalance":"twilight"};
        console.log('(whiteBalance: twilight)');
      } else if (wBalance == null) {
        whiteBalance = {"whiteBalance":"auto"};
        console.log('(whiteBalance: auto)');
      }
      pathSettings();
    });
  }
}
pictureNumber();

var i = 0; // event counter
var j = 0; // pictures counter

function run(){
  function thetaS (){
    j++;
    camera.startSession().then(function(res){
      console.log("Initializing session...");
      sessionId = res.body.results.sessionId;
      console.log('Session ID: ' + sessionId);
      return camera.setOptions(sessionId,modality,iso,shutterSpeed,whiteBalance);
    })

    .then(function(res){
      console.log('Starting things...');
      console.log('Taking pictures...');
      return camera.takePicture(sessionId);
    })

    .then(function (res) {
      console.log('Naming picture...');
      var pictureUri = res.body.results.fileUri;
      console.log('Picture name :%s',pictureUri); //autoname file
      console.log('Downloading picture...');
      var path = pictureUri.split('/');
      filename = dir + '/' + path.pop(); //name of file
      return camera.getImage(pictureUri);
    })

    .then(function(res){
      var imgData = res.body;
      console.log('Downloading complete!');
      fs.writeFile(filename,imgData,() => {});
      console.log('Session closed!');
      if (j == (n + 1)) {}
      else {
        emitters[i].emit('fatto');
      }
      i++;
      return camera.closeSession(sessionId);
    });
  }
  function logging(){
    console.log('\n');
    console.log('Picture n° ' + (j));
  }
  thetaS();
  logging();
  emitters.forEach(function(e){
    e.once('fatto',() => {thetaS();logging();});
  });
}