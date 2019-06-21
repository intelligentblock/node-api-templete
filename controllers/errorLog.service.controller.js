const pg = require("pg");
import { createClient } from '../helper';
export const getErrorLogList = async function (req, res) {
  var client = await createClient();
  client.connect();
  var from_date = new Date(req.params.from);
  var to_date = new Date(req.params.to);

  client.query('SELECT * FROM t_error_logs WHERE error_date BETWEEN $1 AND $2',[from_date, to_date], function (err, result) {
    client.end();
    if (result) {
      res.status(200).send(result.rows);
    }
    if (err) {
      return res.json({ 'success': false, 'message': 'Unable to load data', err });
    }
  });

}

var addErrorLog = async function (error) {
  
  try{
  var client = await createClient();
  client.connect();
 
  var text = 'INSERT INTO t_error_logs(error_type_id, error_title, error_detail, error_date) VALUES($1, $2, $3, $4) RETURNING *';
  var values = [
    error.code,
    error.message,
    error.stack,
    new Date()
  ];

  await client.query(text, values);
  client.end();
  }catch(err){
    console.log(err);
  }
}

exports.addErrorLog = addErrorLog;
