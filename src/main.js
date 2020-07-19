const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
var sql = require('sql.js');
const notifier = require('node-notifier');
var db;
var fs = require("fs");
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var fileExists = 0;
var emailid;

var filebufferuser = fs.readFileSync(__dirname+'/user.sqlite');
// Load the db
userdb = new SQL.Database(filebufferuser);

var options = {
    siteType:"file",
    streamType:"jpeg",
    shotSize: {
        width: "all",
        height: "all"
    }
};
// const electron = require('electron');
/* require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
}); */

if (fs.existsSync('./filename.sqlite')) {
    console.log('file exists');
    fileExists = 1;
}else {fileExists = 0;
    console.log('file absent');}

if(fileExists == 0){
    db = new sql.Database();
}else if(fileExists == 1){
    var filebuffer = fs.readFileSync(__dirname+'/filename.sqlite');
    // Load the db
    db = new SQL.Database(filebuffer);
}

let win;

function createWindow(){

	win = new BrowserWindow({width:800,height:600,icon: __dirname + '/build/icon.ico'});
	win.loadURL(url.format({
		pathname : path.join(__dirname,'admin_index.html'),
		protocol : 'file:',
		slashes : true
	}));

    // win.webContents.openDevTools();

    if(fileExists ==0){
        sqlstr = `CREATE TABLE inventory 
                    (machinery text,
                    datePick text,
                    cost real,
                    place text,
                    billnumber text,
                    rent numeric,
                    status text,
                    placeofrepair text,
                    repaircost numeric,
                    dateReturn text
                    );`;
        // sqlstr += "INSERT INTO inventory VALUES ('hi','dgdg',64646,'rtr','tete',51223,'fgf','fhf',4646,'dfg');"
        db.run(sqlstr);

        sqlstr = `CREATE TABLE rent 
        (id integer primary key,
        machinery text,
        issuedto text,
        noofitems real,
        issuedate text,
        returndate text,
        rent numeric,
        purpose text,
        status text,
        damage text,
        email text);`;
        // sqlstr += "INSERT INTO inventory VALUES ('hi','dgdg',64646,'rtr','tete',51223,'fgf','fhf',4646,'dfg');"
        db.run(sqlstr);
    };
    

	win.on('closed',()=>{
		win = null;
    });
    
    win.on('close',()=>{
        var data = db.export();
        var buffer = new Buffer(data);
        fs.writeFileSync("filename.sqlite", buffer);
        db.close();
    })

}

app.on('ready',createWindow);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
                type: 'OAuth2',
                user:'pranarobotics@gmail.com',
                clientId:'165211424209-mcsjn9n6220smi7as1r24hbl70hmm8ns.apps.googleusercontent.com',
                clientSecret:'tTYXZK0VQ95tAOKNIeMhBzqz',
                refreshToken:'1/FYwpYzJS88UDgmixSe57qCJConzjpaK9xMIntWS2tybDWmJ4Wf_-kWXWc9iUaTqj'
            
    }
});

var mailOptions = {
    from:"pranarobotics@gmail.com",
    to:"pruthulpa07@yahoo.com",
    subject:"this is an .E6P generated mail",
    text:" ERPv2 function dependency : nodemailer@4.6.8 + xoauth2@1.2.0 , your token is attached with this mail",
    attachments:[
        {
            filename:"token.pdf",
            path: __dirname+"/token.pdf",
            contentType: 'application/pdf'
        }
    ]
}

ipcMain.on("datasent",(event,arg,arg1)=>{
    var stmt = db.prepare("INSERT INTO inventory VALUES (?,?,?,?,?,?,?,?,?,?)");
    console.log(arg1);
    stmt.bind(arg1);
    stmt.step();
    stmt.free();

});

ipcMain.on("datasent2",(event,arg1)=>{
    var stmt = db.prepare("INSERT INTO rent VALUES (NULL,?,?,?,?,?,?,?,?,?,?)");
    console.log(arg1);
    stmt.bind(arg1);
    stmt.step();
    stmt.free();

});

var TABLENAME,KEYWORD;

ipcMain.on("searchRequest",(event,tableName,keyword)=>{
    TABLENAME = tableName;
    KEYWORD = keyword;
    console.log(tableName,keyword);
    // Prepare an sql statement
    var result;
    var str;
    if(tableName == 'rent'){
        str = `SELECT * FROM rent WHERE (status ='${keyword}'  OR issuedto='${keyword}' OR machinery='${keyword}' OR 
        purpose='${keyword}')`;
        result = db.exec(str);
    }
    if(tableName == 'inventory'){
        str = `SELECT * FROM inventory WHERE (status ='${keyword}' OR 
        machinery='${keyword}' OR datePick='${keyword}' OR billnumber='${keyword}'
         OR dateReturn='${keyword}')`;
        result = db.exec(str);
    }

    // Bind values to the parameters and fetch the results of the query
    // var result = stmt.get({':keyword' : keyword});
    if(result.length>0){
        console.log(result[0].values);
         win.webContents.send("searchResult",result[0]);
    }else{
        result = [];
    };

    
});

ipcMain.on("searchShown",(event,mailid)=>{
    mailOptions.to = mailid;
    win.webContents.printToPDF({marginsType: 0,printBackground: false,printSelectionOnly: false,landscape: false}, (error, data) => {
        if (error) throw error
        fs.writeFile('token.pdf', data, (error) => {
          if (error) throw error
          console.log('Write PDF successfully.')
          transporter.sendMail(mailOptions,(err,res)=>{
            if(err){
                console.log(err);
                notifier.notify(
                    {
                      title: 'Token Sent Failed',
                      message: 'Mail not sent!',
                    //   icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
                      sound: true, // Only Notification Center or Windows Toasters
                      wait: false // Wait with callback, until user action is taken against notification
                    },
                    function(err, response) {
                      // Response is response from notification
                    }
                  );
                  win.webContents.send("mailSent");
            }else {
                console.log("Mail Sent");
                win.webContents.send("mailSent");
                notifier.notify(
                    {
                      title: 'Token Sent',
                      message: 'Token has been mailed to recipient!',
                    //   icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
                      sound: true, // Only Notification Center or Windows Toasters
                      wait: false // Wait with callback, until user action is taken against notification
                    },
                    function(err, response) {
                      // Response is response from notification
                    }
                  );
                }
            })
        })
      });


})

ipcMain.on("dueSearch",(event,date)=>{
    var str2, result2;
    str2 = `SELECT * FROM rent WHERE returndate = '${date}' `;
    result2 = db.exec(str2);
    console.log(typeof(date));
    if(result2.length>0){
        win.webContents.send("dueResult",result2[0].values);
    };
})

ipcMain.on("delRequest",(event,clickedRow)=>{

    console.log("del request",clickedRow[0]);
    sqlstr = `DELETE FROM rent WHERE id = ${clickedRow[0]};`
    db.run(sqlstr);

    var result,tableName = TABLENAME,keyword = KEYWORD;
    var str;
    if(tableName == 'rent'){
        str = `SELECT * FROM rent WHERE (status ='${keyword}'  OR issuedto='${keyword}' OR machinery='${keyword}' OR 
        purpose='${keyword}')`;
        result = db.exec(str);
    }
    if(tableName == 'inventory'){
        str = `SELECT * FROM inventory WHERE (status ='${keyword}' OR 
        machinery='${keyword}' OR datePick='${keyword}' OR billnumber='${keyword}'
         OR dateReturn='${keyword}')`;
        result = db.exec(str);
    }

    console.log(result);

    // Bind values to the parameters and fetch the results of the query
    // var result = stmt.get({':keyword' : keyword});
    if(result.length>0){
        console.log(result[0].values);
         win.webContents.send("searchResult",result[0]);
    }else{
        win.webContents.send("noResult");
    };
})

ipcMain.on("loginRequest",(event,username,password)=>{
    var str3 = `SELECT * FROM Users WHERE username = '${username}'`;
    var result3 = userdb.exec(str3);
    console.log(userdb);
    if(result3.length>0){
        if(result3[0].values[0][1] == password ){
            win.webContents.send("passMatch");
        }else{
            win.webContents.send("passWrong");
        }
    }else{
        win.webContents.send("passWrong");
    }
})
app.on('window-all-closed',()=>{
	if(process.platform !== 'darwin'){
        // var data = db.export();
        // var buffer = new Buffer(data);
        // fs.writeFileSync("filename.sqlite", buffer);
        // db.close();
		app.quit();
	}
})