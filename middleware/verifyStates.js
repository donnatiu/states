const stateJSONData = require('../model/states.json');

const verifyStates = (req, res, next) => {
    // Convert the user's desired the state abbreviation code, 
    // stateAbbrev (from req parameter), to all UPPERCASE for proper 
    // comparison to the state abbreviation code provided in states.json 
    const stateAbbrev = req.params.state.toUpperCase();

    // Create an array statesCodes that only contains the 50 state 
    // abbreviation codes from the states.json
    const stateCodes = stateJSONData.map(st => st.code);
    
    // Compare the user's desired the state abbreviation code, 
    // stateAbbrev (from req parameter), to each element in the 
    // statesCodes array to see if the state abbreviation code exists 
    // in states.json
    const isState = stateCodes.find(code => code === stateAbbrev);

    // If the desired the state abbreviation code (req parameter, 
    // stateAbbrev)...
        // does NOT exist in states.json: 
            // Send the appropriate error message.
            if (!isState) {
                return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
            }
        // DOES exist in states.json:      
            // Attach it to the request and call next()
            req.params.state = stateAbbrev;
            next();
}

module.exports = verifyStates;
