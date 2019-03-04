'use strict';

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


function listTeamMembers(intent, session, callback) {
    let response = "The group members for team Cloud Cloud are: Bibhav Bhattari, Kyle Haulenbeek, Kevin Hubbard, and Sean Ramuchak";
    callback({}, buildSpeechletResponse(intent.name, response, '', false));
}
function listClassRankings(intent, session, callback) {
    let response = "Sean, Kyle, and Kevin are seniors and Bibhav is a graduate student.";
    callback({}, buildSpeechletResponse(intent.name, response, '', false));
}
function assignmentDueDate(intent, session, callback) {
    let response = "The first assignment for the cloud cloud group is due on February 15.";
    callback({}, buildSpeechletResponse(intent.name, response, '', false));
}

function onLaunch(intent, session, callback) {
    let response = "Welcome to the cloud cloud team service, how may I help?";
    callback({}, buildSpeechletResponse(intent.name, response, '', false));
}
function onIntent(intentRequest, session, callback) {
    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
    console.log(intentName);

    // Dispatch to your skill's intent handlers
    if (intentName === 'ListTeamMembers') {
        listTeamMembers(intent, session, callback);
    } else if (intentName === "ListClassRankings") {
        listClassRankings(intent, session, callback);
    } else if (intentName == "AssignmentDueDate") {
        assignmentDueDate(intent, session, callback);
    }
    
    else {
        throw new Error('Invalid intent');
    }
}


exports.handler = (event, context, callback) => {
    try {
        if (event.session.application.applicationId !== 'amzn1.ask.skill.c3dcd8dc-3272-4eee-9429-ea421cb359f8') {
             callback('Invalid Application ID');
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
