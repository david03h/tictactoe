var fs = require('fs');
require('colors');

try{
    var data = fs.readFileSync('config.json','utf8');
}catch(e){}

class Config {

    errors = {
        path: {
            undefined: (path) => `Path: ${path} does not exist`.red.bold,
            empty: (path) => `This path is empty: ${path.green} `.red,
            type: "Path should be string".red.bold 
        },
        src: {
            wrong_id: (id) => `There's no directory with id:`.red + ` ${id.toString().green} `+`on path: `.red + `${this.path.green}`.red,
            wrong_name: (name) => `There's no directory with name: `.red+`${name}`.green +` on path: `.red + `${this.path.green}`.red,
            arrayType: "Invalid input in src array".red,
            type: "Invalid src. Please input a number,string,array of numbers or array of strings in your config.json file.".red
        }
    }

    constructor(){
        let config;
        data ? config = JSON.parse(data) : config = undefined;
        // Default path
        this.path = "./src/components";

        if(config && config.path != undefined){
            if(typeof config.path == "string"){
                if(fs.existsSync(config.path)){
                    this.path = config.path;
                }else{
                    throw ReferenceError(this.errors.path.undefined(config.path));
                }
            }else{
                throw TypeError(this.errors.path.type);
            }
        }
        this.srcs = getAllDirectories(this.path);

        if(this.srcs.length == 0){
            throw ReferenceError(this.errors.path.empty(this.path));
        }

        if(config && config.src != undefined){
            if(typeof config.src == "number"){
                if(config.src <= this.srcs.length-1 && config.src >= 0){
                    this.src = this.srcs[config.src];
                }else{
                    throw ReferenceError(this.errors.src.wrong_id(config.src));
                }
            }

            else if(typeof config.src == "string"){
                let err = false;
                this.srcs.indexOf(config.src) > -1 ? this.src = this.srcs[this.srcs.indexOf(config.src)] : err = true;
                if(err){
                    throw ReferenceError(this.errors.src.wrong_name(config.src));
                }
            }

            else if(typeof config.src == "object"){
                this.src = [];

                for(let source of config.src){
                    if(typeof source == "number"){
                        if(source > this.srcs.length-1 || source < 0) throw ReferenceError(this.errors.src.wrong_id(source));

                        this.src.push(this.srcs[source]);
                    }else if(typeof source == "string"){
                        if(this.srcs.indexOf(source) == -1) throw ReferenceError(this.errors.src.wrong_name(source));
                        
                        this.src.push(this.srcs[this.srcs.indexOf(source)]);
                    }else{
                        throw TypeError(this.errors.src.arrayType);
                    }
                }
            }else{
                throw TypeError(this.errors.src.type);
            }
        }else{
            this.src = this.srcs;
        }
    }

    getDirectory(){
        let dirs = [];
        for(let i = 0;i<this.src.length;i++){
            dirs[i] = `${this.path}/${this.src[i]}/scss/**/*.scss`;
        }
        return dirs;
    }
}

module.exports = Config;

function getAllDirectories(path){
    var directories = [];
    directories = fs.readdirSync(path);
    for(let i = 0;i<directories.length;i++){
        var ele = directories[i];
        if(!fs.lstatSync(`${path}/${ele}`).isDirectory()){
            directories[i] = "";
        }
    }
    directories = directories.filter(val => val != '');
    
    return directories;
}