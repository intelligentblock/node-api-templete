import { addErrorLog } from './errorLog.service.controller';
import { createClient } from '../helper';
const pg = require("pg");
export const addInstraction = async (req, res) => {
    try{
    //Validation
    if(!req.body.instraction){
        return res.json({
            'success':false,
            'message':'Instraction  not found'
        })
    }
const client = await createClient();
client.connect();
const createInstractionQuery = 'INSERT into s_instraction(instraction) VALUES($1)';
const value = [req.body.instraction];

await client.query(createInstractionQuery, value)
.then(result=>{
    client.end();
    return res.json({
        'success':true,
        'message':'Instraction inserted',
    })
}).catch(err=>{
    client.end();
    addErrorLog(err); 
    return res.json({
        'success':false,
        'message':err.message
    });
})
    } catch(err){
      client.end();
    addErrorLog(err);         
    }
}


export const readAllInstraction = async (req, res) => {
   try{
    var client = await createClient();
    client.connect();
    const readInstractionQuery = 'SELECT * FROM s_instraction ORDER BY id ASC'

    await client.query(readInstractionQuery)
        .then(result => {
            client.end();
            return res.json(result.rows);
        })
        .catch(err => {
            client.end();
            addErrorLog(err);
            return res.json({ 'success': false, 'message': err.message });
        });
}catch(err){
  client.end();
    addErrorLog(err);
}
}




export const getInstractionById = async (req, res) =>{
    try{
    const client = await createClient();
    client.connect();
    const getByIdInstractionQuery = 'select * from s_instraction where id = $1';
    const value = [req.params.id];
    await client.query(getByIdInstractionQuery,value)
    .then(result=>{
        client.end();
        return res.json(result.rows)
    }).catch(err=>{
        client.end();
        addErrorLog(err);           
        return res.json({
            'success':false,
            'message':err.message
        })
    })
} catch(err){
  client.end();
    addErrorLog(err);             
}
}


export const updateInstractionById = async (req, res)=>{
    try{
     //Validation
    if(!req.body.instraction){
        return res.json({
            'success':false,
            'message':'Instraction  not found'
        })
    }


const client = await createClient();
client.connect();
const updateinstractionQuery = 'UPDATE  s_instraction SET instraction=$1 where id =$2';
const value = [req.body.instraction, req.params.id];

await client.query(updateinstractionQuery, value)
.then(result=>{
    client.end();
    return res.json({
        'success':true,
        'message':'Instraction Updated',
    }).catch(err=>{
        client.end();
        addErrorLog(err);                 
            return res.json({
                'success':false,
                'message':err.message
            })
        })
})
} catch(err){
  client.end();
    addErrorLog(err);             
}
}


export const deleteInstracvtionById = async (req, res)=>{
    try{
    const client = await createClient();
    client.connect();
    const deleteInstractionQuery = 'DELETE from s_instraction where id = $1';
    const value = [req.params.id];
    await client.query(deleteInstractionQuery,value)
    .then(result=>{
        client.end();
      return res.json({
        'success':true,
        'message':'Instraction deleted'
      }).catch(err=>{
        client.end();
        addErrorLog(err);                 
            return res.json({
                'success':false,
                'message':err.message
            })
        })
    })
} catch(err){
  client.end();
    addErrorLog(err);
}
}

