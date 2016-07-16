var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTransporter = require('role.transporter');
var roleRepairer = require('role.repairer');

module.exports.loop = function () {
    // Always place this memory cleaning code at the very top of your main loop!
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];

            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');


    console.log('Harvesters: ' + harvesters.length);
    console.log('Upgraders : ' + upgraders.length);
    console.log('Builders : ' + builders.length);
    console.log('Transporters : ' + transporters.length);
    console.log('Repairers : ' + repairers.length);
    
    if(repairers.length < 2) {
        var newName = Game.spawns.Fenris.createCreep([WORK,CARRY, MOVE, CARRY,MOVE,CARRY,MOVE], undefined, {role: 'repairer'});
    }
    
    if(builders.length < 2) {
        var newName = Game.spawns.Fenris.createCreep([WORK,WORK,WORK,CARRY,MOVE,CARRY, MOVE, CARRY, MOVE], undefined, {role: 'builder'});
    } 
    
    if(upgraders.length < 2) {
        var newName = Game.spawns.Fenris.createCreep([WORK,WORK,WORK,CARRY,MOVE,CARRY, CARRY, MOVE, MOVE], undefined, {role: 'upgrader'});
    }

    if(transporters.length < 4) {
        var newName = Game.spawns.Fenris.createCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, {role: 'transporter'});
    }
    
    if(harvesters.length < 4) {
        var newName = Game.spawns.Fenris.createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], undefined, {role: 'harvester'});
    }
    
    for(var name in Game.structures)
    {
        var tower = Game.structures[name];
        if(tower.structureType == STRUCTURE_TOWER){
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile){
                tower.attack(closestHostile);
            }
        }
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}