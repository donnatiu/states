
/*Imports*/

const { json } = require('express/lib/response'); 
const State = require('../model/State');
const statesJSONData = require('../model/states.json');

/*GET*/

/* The REST API will provide responses to the following GET requests: */

/**
 * Response: All state data returned
 * @type {import("express").RequestHandler}
 */
const getAllStates = async (req, res) => {
    // Store the user's desired boolean value (from req parameter) in
    // contig variable
        // contig=true: user desires contiguous states (not AK or HI)
        // contig=false: user desires non-contiguous states (AK, HI)
    const { contig } = req.query;

    // Store a list of states from statesJSONData in an array consisting
    // ONLY of state names
    let statesList = statesJSONData;

    // If contig=false: return non-contiguous states ONLY from statesList
    if (contig === 'false') {
        statesList = statesJSONData.filter(st => st.code === 'AK' || st.code === 'HI');
        return res.json(statesList);
    }

    // If contig=true: return contiguous states ONLY from statesList
    if (contig === 'true') {
        statesList = statesJSONData.filter(st => st.admission_number < 49);
        return res.json(statesList);
    }
    
    // Store all of the state data documents from MongoDB collection in
    // mongoStates variable
    const mongoStates = await State.find();

    // Loop through statesList array
    statesList.forEach(state => {
        // Attempt to find the state in MongoDB collection
        const stateExists = mongoStates.find(st => st.stateCode === state.code);
        // If the state exists, attach 'funfact' property to the state object
        if(stateExists) {
            let funfactArray = stateExists.funfacts;
            if (funfactArray.length !== 0) {
                state.funfacts = [...funfactArray]; 
            }
        }
    });
    res.json(statesList);
}

/**
 * Response: All data for the state URL parameter
 * @type {import("express").RequestHandler}
 */
const getState = async (req, res) => {    
    // Store the user's desired state code (from req parameter) in 
    // stateReq variable
    const stateReq = req.params.state;

    // Find all state data for user's desired state from statesJSONData
    const stateData = statesJSONData.find(state => state.code === stateReq);

    // Get all state data documents from MongoDB 
    const mongoStates = await State.find();
    
    // Determine whether user's desired state exists in MongoDB collection
    const stateExists = mongoStates.find(st => st.stateCode === stateData.code);
    
     // If one or more funfacts exist, attach them to new funfactArray
    if(stateExists) {
        let funfactArray = stateExists.funfacts;
        if (funfactArray.length !== 0) {
            stateData.funfacts = [...funfactArray]; 
        }
    }
    res.json(stateData);
}

/**
 * Response: A random fun fact for the state URL parameter
 * @type {import("express").RequestHandler}
 */
const getStateFunFact = async (req, res) => {
    // Store the user's desired state (from req parameter) in stateReq 
    // variable
    const stateReq = req.params.state;

    // Find the user's desired state in statesJSONData
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get all state data documents from MongoDB 
    const mongoStates = await State.find();
    
    // Determine whether specified state exists in MongoDB collection
    const stateExists = mongoStates.find(st => st.stateCode === stateData.code);
    
    // Get the funfacts array from MongoDB
    const funfactArray = stateExists?.funfacts;

    // If no fun facts exist in funfacts array, send the appropriate 
    // error message
    if (!funfactArray) {
        return res.status(400).json({ "message": `No Fun Facts found for ${stateData.state}`});
    }
    
    // Generate a random number between 0 and array length
    let randomNum = Math.floor(Math.random()*funfactArray.length);
    
    // Get funfact at random index
    let funfact = funfactArray[randomNum];

    // Send a response with the random funfact for the user's desired state
    res.json({ funfact });
}

/**
 * Response: { ‘state’: stateName, ‘capital’: capitalName }
 * @type {import("express").RequestHandler}
 */
const getStateCapital = (req, res) => {
    // Store the user's desired state (from req parameter) in stateReq 
    // variable
    const stateReq = req.params.state;

    // Find the user's desired state from statesJSONData
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get the state name and capital for the user's desired state
    const state = stateData.state;
    const capital = stateData.capital_city;

    // Create a response with the state name and capital for the user's 
    // desired state
    res.json({ state, capital });
}

/**
 * Response: { ‘state’: stateName, ‘nickname’: nickname }
 * @type {import("express").RequestHandler}
 */
const getStateNickname = (req, res) => {
    // Store the user's desired state (from req parameter) in stateReq 
    // variable
    const stateReq = req.params.state;

    // Find the user's desired state from statesJSONData
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get the state name and nickname for the user's desired state
    const state = stateData.state;
    const nickname = stateData.nickname;

    // Create a response with the state name and nickname for the user's 
    // desired state
    res.json({ state, nickname });
}

/**
 * Response: { ‘state’: stateName, ‘population’: population }
 * @type {import("express").RequestHandler}
 */
const getStatePopulation = (req, res) => {
    // Store the user's desired state (from req parameter) in stateReq 
    // variable
    const stateReq = req.params.state;

    // Find the user's desired state from statesJSONData
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get the state name and population for the user's desired state
    const state = stateData.state;
    const popInt = stateData.population;

    // Convert population from int to string and add commas
    const population = popInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Create a response with the state name and population for the 
    // user's desired state
    res.json({ state, population });
}

/**
 * Response: { ‘state’: stateName, ‘admitted’: admissionDate }
 * @type {import("express").RequestHandler}
 */
const getStateAdmission = (req, res) => {
    // Store the user's desired state (from req parameter) in stateReq 
    // variable
    const stateReq = req.params.state;

    // Find the user's desired state from statesJSONData
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get the state name and admission date for the user's desired state
    const state = stateData.state;
    const admitted = stateData.admission_date;

    // Create a response with the state name and admission date for the 
    // user's desired state
    res.json({ state, admitted });
}

/*POST*/

/* The REST API will provide responses to the following POST request: */

/**
 * Response: The result received from MongoDB
 */
const createStateFunFact = async (req, res) => {
    // Verify that funfacts is included in request body
    if(!req.body.funfacts) {
        return res.status(400).json({"message": "State fun facts value required"});
    }

    // Get state code from URL parameter
    const stateCode = req.params.state;
    const funfacts = req.body.funfacts;

    // Verify that funfacts in request body are passed in as array
    if (!(funfacts instanceof Array) || funfacts instanceof String) {  
        return res.status(400).json({"message": "State fun facts value must be an array"});
    }

    // Find the requested state in MongoDB collection
    const foundState = await State.findOne({stateCode: stateCode});

    // If there is no existing array of funfacts for the user's desired  state, then 
    // create a new document with request body parameters
    if (!foundState) {
        try {
            const result = await State.create({
                stateCode: stateCode,
                funfacts: funfacts
            });
            console.log(typeof result);
            res.status(201).json(result);
        }
        catch (err) {
            console.error(err);
        }
    }
    else {
        // If the user's desired state has an existing array of funfacts, then add the new 
        // funfacts to them (do NOT delete existing funfacts)
        let funfactArray = foundState.funfacts;
        funfactArray = funfactArray.push(...funfacts);
        const result = await foundState.save();
        res.status(201).json(result);
    }
}

/*PATCH*/

/* The REST API will provide responses to the following PATCH request: */

/**
 * Response: The result received from MongoDB
 */
const updateStateFunFact = async (req, res) => {
    // Verify that an index value is included in the request body 
    if(!req.body.index) {
        return res.status(400).json({"message": "State fun fact index value required"});
    }
    // Verify that a funfact value was included in request body (must be of type String)
    if(!req.body.funfact || req.body.funfact instanceof Array) {
        return res.status(400).json({"message": "State fun fact value required"});
    }

    // Subtract 1 from user-submitted index value to match up with the correct index of the 
    // funfacts array in MongoDB
    const index = parseInt(req.body.index) - 1; 
    
    // Get the state code of the user's desired state from the URL parameter
    const stateCode = req.params.state;
    
    // Get corresponding state name from statesJSONData (to use for invalid input responses)
    const stateData = statesJSONData.find(state => state.code === stateCode);
    const stateName = stateData.state;
    
    // Get funfact from request body to update existing funfact
    const funfact = req.body.funfact;

    // Find the user's desired state in MongoDB collection
    const foundState = await State.findOne({stateCode: stateCode});

    // Get funfacts array for user's desired state
    let funfactArray = foundState?.funfacts;

    // If no funfacts exist for the user's desired state, send the appropriate error message
    if(!funfactArray) {
        return res.status(400).json({"message": `No Fun Facts found for ${stateName}`});
    }
    // If no funfacts exist at the specified index, send the appropriate error message
    if(!funfactArray[index]) {
        return res.status(400).json({"message": `No Fun Fact found at that index for ${stateName}`});
    }

    // Set the fun fact (element) at the specified index to the new fun fact value
    funfactArray[index] = funfact;

    // Save the record and respond with the result received from the model
    const result = await foundState.save();
    res.status(201).json(result);
}

/*DELETE*/

/* The REST API will provide responses to the following DELETE request: */

/**
 * Response: The result received from MongoDB
 */
const deleteStateFunFact = async (req, res) => {
    // Verify that an index value is included in the request body 
    if(!req.body.index) {
        return res.status(400).json({"message": "State fun fact index value required"});
    }
    
    // Subtract 1 from user-submitted index value to match up with the correct index of the 
    // funfacts array in MongoDB
    const index = parseInt(req.body.index) - 1;

    // Get the state code of the user's desired state from the URL parameter
    const stateCode = req.params.state;

    // Get corresponding state name from statesJSONData (to use for invalid input responses)
    const stateData = statesJSONData.find(state => state.code === stateCode);
    const stateName = stateData.state;
    
    // Find the user's desired state in MongoDB collection
    const foundState = await State.findOne({stateCode: stateCode});

    // Get funfacts array for user's desired state
    let funfactArray = foundState?.funfacts;

    // If no funfacts exist for the user's desired state, send the appropriate error message
    if(!funfactArray) {
        return res.status(400).json({"message": `No Fun Facts found for ${stateName}`});
    }
    // If no funfacts exist at the specified index, send the appropriate error message
    if(!funfactArray[index]) {
        return res.status(400).json({"message": `No Fun Fact found at that index for ${stateName}`});
    }

    // Splice and remove specified index from funfacts
    funfactArray.splice(index, 1);

    // Save the record and respond with the result received from the model
    const result = await foundState.save();
    res.status(201).json(result); 
}

/*Exports*/
module.exports = {
    getAllStates, 
    getState, 
    getStateFunFact,
    getStateCapital,
    getStateNickname, 
    getStatePopulation,
    getStateAdmission,
    createStateFunFact,
    updateStateFunFact,
    deleteStateFunFact
}