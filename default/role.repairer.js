/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairer');
 * mod.thing == 'a thing'; // true
 */

var roleDefinition = {
    run : function(creep) {
        //if you're not already full of energy - go get some
        if(creep.carry.energy < creep.carryCapacity && !creep.memory.repairing){
            //if you don't have a destination figure one out.
            if(!creep.memory.targetContainer){
                var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 100;
                    }
                    }); 
                if(targets.length == 0){return;}
                var target = _.sortBy(targets, function(o){return o.store[RESOURCE_ENERGY];}).reverse()[0];
                creep.memory.targetContainer = target.id;
            }
            //hop to it!
            if(creep.withdraw(Game.getObjectById(creep.memory.targetContainer), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){  
                creep.moveTo(Game.getObjectById(creep.memory.targetContainer));
            }
            else
            {
                creep.memory.targetContainer = null;
            }
        } 
        else if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity){
            creep.memory.repairing = true;
        }
        //Got juice? Go repair something for god's sake!
        else if(creep.memory.repairing){
            var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 50000});
            
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
    }
};

module.exports = roleDefinition;