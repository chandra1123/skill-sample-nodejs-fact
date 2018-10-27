/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const cookbook = require('./alexa-cookbook.js');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

const SKILL_NAME = 'Scala Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a scala fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const FALLBACK_MESSAGE = 'The Scala Facts skill can\'t help you with that.  It can help you discover facts about scala if you say tell me a scala fact. What can I help you with?';
const FALLBACK_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-nodejs-fact/tree/en-US/lambda/data
//=========================================================================================================================================

const data = [
  'Scala interpreter is the easiest way to get started with the language.',
  'Scala interpreter is an interactive shell for writing programs and expressions.',
  'Any computable statement is an expression in Scala.',
  'If an expression does not have anything to return, it returns a value of type Unit.',
  'The keyword val is used to declare values.',
  'Values are immutable. We cannot reassign the value.',
  'The keyword var is used to declare variables.',
  'We do not use the return keyword to return the result. Rather, a method returns the value of the last expression evaluated.',
  'If a method does not take any parameters, we may omit the parentheses during definition and invocation. Additionally, we may omit the braces if the body has only one expression.',
  'Control structures allow us to alter the flow of control in a program. We have the following control structures: If-else expression, While loop and do while loop, For expression, Try expression and Match expression.',
  'Unlike Java, Scala does not have continue or break keywords.',
  'Scala does not have have the ternary operator.',
  'For expression can iterate over single or multiple collections. Moreover, it can filter out elements as well as produce new collections.',
  'We can define functions inside functions. They are referred to as nested functions or local functions. Similar to the local variables, they are visible only within the function they are defined in.',
  'We refer to functions which operate on functions as higher-order functions. They enable us to work at a more abstract level. Using them, we can reduce code duplication by writing generalized algorithms.',
  'Higher-Order functions tend to create many small single-use functions. We can avoid naming them by using anonymous functions.',
  'Scala uses by-value parameters by default. If the parameter type is preceded by arrow ( =>), it switches to by-name parameter.',
  'Traits correspond to Java interfaces with some differences. They can extend from a class, access superclass members and  initializer statements.',
  'Classes, objects, and traits can inherit at most one class but any number of traits.',
  'We use object definitions to implement utility methods and singletons.',
  'We do not have static members in Scala. We use companion objects to implement static members.',
  'Pattern matching matches an expression to a sequence of alternatives.',
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const randomFact = cookbook.getRandomItem(data);
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallbackIntent is only currently available in en-US locale.
  //              This handler will not be triggered except in that locale, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
