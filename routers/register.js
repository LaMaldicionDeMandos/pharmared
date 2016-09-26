/**
 * Created by mandos on 19/09/16.
 */
var request=require('request');
var q=require('q');

var router = require('express').Router();
var registerPharmacy = function(req, res) {
    var form=req.body;
    console.log(form.fantasyName);

    confirmEntity(form.cuit,'pharmacy').then(
        function(socialName) {
            regEntity(form, socialName, 'pharmacy').then(
                function() {
                    res.status(201).send('Farmacia Registrada') ;
                },
                function(error){
                    console.log('regError');
                    res.status(400).send ('Farmacia no Registrada - Error Registro');
                });
        },
        function(error){
            res.status(400).send ('Farmacia no Registrada - Error Validación');
        });
};
router.post('/pharmacy', registerPharmacy);



var confirmEntity=function(cuit,entityName) {
    var def = q.defer();

    request(config.validator_url+entityName + '/'+cuit, function (error, response, body) {

        var result = body;
        if (error)  {
            def.reject(error);
        }
        else if (!result.valid){
            def.reject('Invalid');
        }

        else {
            console.log('valid');
           def.resolve(result.name);
        }

    });
    return def.promise;
}


var regEntity=function(form,socialName,entityName) {
    var def = q.defer();

    var arrayName=form.fullName.split(" ",2);
    var firstName=arrayName[0];
    var lastName=arrayName[1];
    var bodyForm={street:form.street,number:form.number,city:form.city,name:socialName,province:form.province,phantasy_name:form.fantasyName,cuit:form.cuit,email:form.email,profile:{first_name:firstName,last_name:lastName}};
    request({
            method: 'post',
            url: config.registration_url+entityName,
            body: bodyForm,
            json: true,
            headers: null
        },
        function(error, response, body){


        var result = body;
        if (error)  {
            def.reject(error);
            console.log('error');
        }

        else {

            def.resolve();
        }

    });
    return def.promise;
};




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

