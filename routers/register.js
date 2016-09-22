/**
 * Created by mandos on 19/09/16.
 */
var request=require('request');
var q=require('q');

var router = require('express').Router();
var registerPharmacy = function(req, res) {
    var form=req.body;
    console.log(form.fantasyName);

confirmEntity(form.cuit,'pharmacy') .then (function() {
    res.status(201).send('Farmacia Registrada');

    },
function(error){
        res.status(400).send (error);
}

)




};
router.post('/pharmacy', registerPharmacy);

var confirmEntity=function(cuit,entityName) {
    var def = q.defer();

    request(config.validator_url+entityName + '/'+cuit, function (error, response, body) {

        var result = JSON.parse(body);
        if (error)  {
            def.reject(error);
        }
        else if (!result.valid){
            def.reject('Invalid');
        }

        else {

           def.resolve();
        }

    });
    return def.promise;
}





var registerPharmacist = function(req, res) {
    var form=req.body;
    console.log(form.email);
    res.status(201).send('Farmacéutico Registrado');
};
router.post('/pharmacist', registerPharmacist);

var registerLaboratory = function(req, res) {
    var form=req.body;
    console.log(form.email);
    res.status(201).send('Laboratorio Registrado');
};
router.post('/laboratory', registerLaboratory);

var registerDrugstore = function(req, res) {
    var form=req.body;
    console.log(form.email);
    res.status(201).send('Droguería Registrada');
};
router.post('/drugstore', registerDrugstore);



module.exports = router;

