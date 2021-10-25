//Note that this rename database operation requires admin DB read and write permissions and this operation migrates only collections, indexes and users, and other database objects need to be handled manually. Depending on the size of the collection, this may take longer to complete. Other operations which require exclusive access to the affected databases will be blocked until the rename completes. 
//The "Rename database" operation is not applicable to sharded collections.
    
const source = "bitgol_users";
const dest = "users";

//Requires admin db Read and Write permissions
function moveUsers() {
    const moveSystemItems=(collection)=>{
        const destItems = collection.where("db").eq(source).map((it) => {
            return { ...it,
                _id: dest + "." + (it.user || it.role),
                db: dest,
                roles: it.roles.map(role => {
                    if (role && role.db && role.db === source) {
                        return {
                            ...role,
                            db: dest
                        }
                    } else return {
                        ...role
                    }
                })
            }
        });
        
        collection.insertMany(destItems);
        collection.deleteMany({ db: source });
        
    }
    
    const hasUsers= db.getSiblingDB(source).getUsers().length>0;
    if (hasUsers){
        moveSystemItems(db.getSiblingDB("admin").getCollection("system.users"));
    }

    const hasRoles= db.getSiblingDB(source).getRoles().length>0;
    if (hasRoles){
        console.warn("Has User-defined Roles, you need to migrate roles manually")
        //moveSystemItems(db.getSiblingDB("admin").getCollection("system.roles"));
    }

    console.log(`move database users and roles, done`);
}

function moveCollections(){
    const colls = db.getSiblingDB(source).getCollectionInfos().filter(it=>!_.startsWith(it.name,"system."));
    
    colls.filter(it=>it.type==="collection").forEach(col=>{
        let renameCollection = source + "." + col.name;
        let to = dest + "." + col.name;
        
        db.adminCommand({ renameCollection, to });
    })
    
    colls.filter(it=>it.type==="view").forEach(col=>{
        const {viewOn, pipeline, ...viewOptions}=col.options;
        db.getSiblingDB(dest).createView(col.name, viewOn, pipeline, viewOptions);
        db.getSiblingDB(source).getCollection(col.name).drop();

    })    

    console.log(`move collections, done`);
}

moveUsers();
moveCollections();
console.log(`move database "bitgol_users" -> "users" done`);
