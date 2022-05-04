const express = require('express');
const router = express.Router();
// const path = require('path');
const statesController = require('../../controllers/statesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyState = require('../../middleware/verifyState');

router.route('/')
    .get(statesController.getAllStates);


router.route('/:state')
    .get(verifyStates, statesController.getState);

    router.route('/:state/funfact')
    .get(verifyStates, statesController.getStateFunFact)
    .post(verifyStates, statesController.createStateFunFact);

    router.route('/:state/capital')
    .get(verifyStates, statesController.getStateCapital);
    
    router.route('/:state/nickname')
    .get(verifyStates, statesController.getStateNickname);
    
    router.route('/:state/population')
    .get(verifyStates, statesController.getStatePopulation);
    
    router.route('/:state/admission')
    .get(verifyStates, statesController.getStateAdmission);

module.exports = router;