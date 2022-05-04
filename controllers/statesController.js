/* IMPORTED DATA */

const { json } = require('express/lib/response'); 
const State = require('../model/State');
const statesJSONData = require('../model/states.json');


/* GET REQUEST FUNCTIONS */

const getAllStates = async (req, res) => {
    // Query parameter
    const { contig } = req.query;
    
    // Holds results of query
    let statesList = statesJSONData;

    // Return non-contiguous states
    if (contig === 'false') {
        statesList = statesJSONData.filter(st => st.code === 'AK' || st.code === 'HI');
        return res.json(statesList);
    }

    // Return contiguous states
    if (contig === 'true') {
        statesList = statesJSONData.filter(st => st.admission_number < 49);
        return res.json(statesList);
    }

    // Get all the states data we have from MongoDB
    const mongoStates = await State.find();

    /* Merge Data Method #1 */
    // use the object spread operator to construct an object containing the properties of the 
    // two separate objects, and then delete the redundant stateCode property from MongoDB
    // let mergedStateData;
    // mergedStateData = {
    //     ...statesList,
    //     ...mongoStates
    // }
    // delete mergedStateData.stateCode;

    /* Merge Data Method #2 */
    // loop through the statesList array with forEach:
    // 1) attempt to find the state from the MongoDB states results
    // 2) if the state is in the results, we will attach the 'funfacts' to the state object
    statesList.forEach(state => {
        // use the array method find to compare values
        const stateExists = mongoStates.find(st => st.stateCode === state.code);
        // if (stateExists), attach the funfacts with dot notation
        // (spreading in the existing array to create a new one)
        if(stateExists) {
            let funfactArray = stateExists.funfacts;
            console.log(funfactArray);
            // One or more funfacts exist
            if (funfactArray.length !== 0) {
                // Attach the funfacts with dot notation
                state.funfacts = [...funfactArray]; 
            }
        }
    });

    // if (!mergedStateData) return res.status(204).json({ 'message': 'No states found.' });
    
    // send the statesList in the response
    res.json(statesList);
}

const getState = async (req, res) => {    
    // URL parameter sent in GET request
    const stateReq = req.params.state;

    // Find the requested state data in the statesJSONData
    const stateData = statesJSONData.find(state => state.code === stateReq);

    // Get all the state data documents from MongoDB 
    const mongoStates = await State.find();
    
    // Determine whether state exists in MongoDB collection
    const stateExists = mongoStates.find(st => st.stateCode === stateData.code);
    
    // Attach the funfacts from MongoDB if they exist
    if(stateExists) {
        let funfactArray = stateExists.funfacts;
        // One or more funfacts exist
        if (funfactArray.length !== 0) {
            // Attach the funfacts with dot notation
            stateData.funfacts = [...funfactArray]; 
        }
    }
    res.json(stateData);
}

const getStateFunFact = async (req, res) => {
    // Get the URL parameter
    const stateReq = req.params.state;

    // Find the specified state from the states.json data
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get all the state data documents from MongoDB 
    const mongoStates = await State.find();
    
    // Determine whether state exists in MongoDB collection
    const stateExists = mongoStates.find(st => st.stateCode === stateData.code);
    
    // Attach the funfacts from MongoDB if they exist
    if(stateExists) {
        let funfactArray = stateExists.funfacts;
        // One or more funfacts exist
        if (funfactArray.length !== 0) {
            // Attach the funfacts with dot notation
            stateData.funfacts = [...funfactArray]; 
        }
        else {
            // No funfacts exist
            return res.json({ "message": `No Fun Facts found for ${stateData.state}`});
        }
    }
    // Get the array of fun facts
    const funfactArray = stateData.funfacts;
    
    // Generate a random number between 0 and array length
    let randomNum = Math.floor(Math.random()*funfactArray.length);
    
    // Get funfact at random index
    let funfact = funfactArray[randomNum];

    // Create a response with the random funfact
    res.json({ funfact });
}

const getStateCapital = (req, res) => {
    // Get the URL parameter
    const stateReq = req.params.state;

    // Find the specified state from the states.json data
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get the state name and capital
    const state = stateData.state;
    const capital = stateData.capital_city;

    // Create a response with the state name and capital
    res.json({ state, capital });
}

const getStateNickname = (req, res) => {
    // Get the URL parameter
    const stateReq = req.params.state;

    // Find the specified state from the states.json data
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get the state name and capital
    const state = stateData.state;
    const nickname = stateData.nickname;

    // Create a response with the state name and capital
    res.json({ state, nickname });
}

const getStatePopulation = (req, res) => {
    // Get the URL parameter
    const stateReq = req.params.state;

    // Find the specified state from the states.json data
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get the state name and capital
    const state = stateData.state;
    // population as int 
    const popInt = stateData.population;   
    // Convert population to string and add commas
    const population = popInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Create a response with the state name and capital
    res.json({ state, population });
}

const getStateAdmission = (req, res) => {
    // Get the URL parameter
    const stateReq = req.params.state;

    // Find the specified state from the states.json data
    const stateData = statesJSONData.find(state => state.code === stateReq);
    
    // Get the state name and capital
    const state = stateData.state;
    const admitted = stateData.admission_date;

    // Create a response with the state name and capital
    res.json({ state, admitted });
}

/* POST REQUEST FUNCTIONS */

const createStateFunFact = async (req, res) => {
    // Verify the necessary values were passed in 
    if(!req.body.stateCode || !req.body.funfacts) {
        return res.status(400).json({"message": "State fun facts value required"});
    }

    // Request body passes in 1) stateCode and 2) array of new funfact(s) 
    const stateCode = req.body.stateCode;
    const funfacts = req.body.funfacts;

    // Verify new funfacts are passed in as array
    if (!(funfacts instanceof Array) || funfacts instanceof String) {   // Maybe add back later: || funfacts.length === 0
        return res.status(400).json({"message": "State fun facts value must be an array"});
    }

    // Find the requested state in MongoDB collection
    const foundState = await State.findOne({stateCode: stateCode});
    console.log(foundState);

    // Create a new record in MongoDB collection with stateCode and funfacts array
    if (!foundState) {
        try {
            const result = await State.create({
                stateCode: stateCode,
                funfacts: funfacts
            });
            res.status(201).json(result);
        }
        catch (err) {
            console.error(err);
        }
    }
    else {
        // If state has an existing array of funfacts, ADD the new funfacts to them (do NOT delete existing funfacts)
        // If the state does NOT have an existing array of funfacts, create a new record in MongoDB collection with stateCode and funfacts array
        let funfactArray = foundState.funfacts;
        funfactArray = funfactArray.push(...funfacts);
        const result = await foundState.save();
        res.status(201).json(result);
    }
}

/* PATCH REQUEST FUNCTIONS */


/* DELETE REQUEST FUNCTIONS */


module.exports = {
    getAllStates, 
    getState, 
    getStateFunFact,
    getStateCapital,
    getStateNickname, 
    getStatePopulation,
    getStateAdmission,
    createStateFunFact
}