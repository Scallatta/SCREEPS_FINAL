var roleTransporter = {
    run : function(creep){
        //if you're not already full of energy - go get some
        if(creep.carry.energy == 0){
            //if you don't have a destination figure one out.
            if(!creep.memory.targetContainer){
                var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= 1000;
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
        //if you've got energy take it somewhere useful
        else {
            //if you don't have a target, get one.
            if(!creep.memory.targetContainer){
                //first check the spawn to see if it needs energy
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION 
                        || structure.structureType == STRUCTURE_SPAWN
                        || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity);
                    }
                });
                
                //if the spawn needs power set as target
                if(targets.length != 0)
                {
                    creep.memory.targetContainer = targets[0].id;
                }
                //if not find the least full container and go there
                else
                {
                    targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity);
                        }
                    });
                    var target = _.sortBy(targets, function(o){return o.store[RESOURCE_ENERGY];})[0];
                    if(targets.length == 0){return;}
                    creep.memory.targetContainer = target.id;
                }
            }
            //GO!
            if(creep.transfer(Game.getObjectById(creep.memory.targetContainer), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(creep.memory.targetContainer));
            }
            else
            {
                creep.memory.targetContainer = null;
            }
        }
    }
}

module.exports = roleTransporter;