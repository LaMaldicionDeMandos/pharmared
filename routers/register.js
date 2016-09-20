/**
 * Created by mandos on 19/09/16.
 */

var router = require('express').Router();
var registerPharmacy = function(req, res) {
    var form=req.body;
    console.log(form.fantasyName);
    res.status(201).send('Farmacia Registrada');
};
router.post('/pharmacy', registerPharmacy);

var registerPharmacist = function(req, res) {
    var form=req.body;
    console.log(form.email);
    res.status(201).send('Farmaceutico Registrado');
};
router.post('/pharmacist', registerPharmacist);




module.exports = router;

