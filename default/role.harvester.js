var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.targetSource){
            var sources = creep.room.find(FIND_SOURCES); 
            
            var harvestors = _.filter(Game.creeps, (o) => o.memory.role == 'harvester' );
            
            for(var i = 0; i < sources.length; i++)
            {
                var harvestorsAssignedToThisSource = _.filter(harvestors, (o) => o.memory.targetSource == sources[i].id).length;
               
                if(harvestorsAssignedToThisSource < 2)
                { 
                    creep.memory.targetSource = sources[i].id;
                    break;
                }
            }
        }
        
        if(creep.carry.energy < creep.carryCapacity) {
            if(creep.harvest(Game.getObjectById(creep.memory.targetSource)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.targetSource));
            }
        }
        else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_EXTENSION 
                    || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity)
                    || ((structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity);
                }
            });
            if(targets.length > 0) {
                var target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleHarvester;