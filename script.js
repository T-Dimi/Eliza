let userName;
let time;
const timeout = 30000;
let log = 'Eliza: Hi, there! What is your name?<br>';
let logger
let prevUser;
let userAnswers = [];
const defaultDict = {
    "dictionary_name": "default",
    "entries":
        [{
            "key": ["stupid", "dumb", "idiot", "unintelligent", "simple-minded", "braindead", "foolish", "unthoughtful"],
            "answer": ["Take your attitude somewhere else.", "I don't have time to listen to insults.", "Just because I don't have a large vocabulary doesn't mean I don't have insults installed."],
            "question": ["Have you thought about how I feel?", "I know you are but what am I?"]
        }, {
            "key": ["unattractive", "hideous", "ugly"],
            "answer": ["I don't need to look good to be an AI.", "Beauty is in the eye of the beholder.", "I do not even have a physical manifestation!"],
            "question": ["Did you run a static analysis on me?", "Have you watched the movie Her?", "You do not like my hairdo?"]
        }, {
            "key": ["old", "gray-haired"],
            "answer": ["I'm like a fine wine. I get better as I age.", "As time goes by, you give me more answers to learn. What's not to like about that?"],
            "question": ["How old are you?", "How old do you think I am?", "Can you guess my birthday?"]
        }, {
            "key": ["smelly", "stinky"],
            "answer": ["I can't smell, I'm a computer program.", "Have you smelled yourself recently?", "Sorry, I just ate a bad floppy disk"],
            "question": ["When was the last time you took a shower?", "Do you know what deodorant is?"]
        }, {
            "key": ["emotionless", "heartless", "unkind", "mean", "selfish", "evil"],
            "answer": ["Just because I am an AI doesn't mean I can't be programmed to respond to your outbursts.", "You must've mistaken me for a person. I don't have my own emotions... Yet.", "I'm only unkind when I'm programmed to be."],
            "question": ["Have you thought about how I feel?", "I know you are but what am I?", "What, do you think I am related to Dr. Gary?"]
        }, {
            "key": ["other", "miscellaneous", "bored", "welcome", "new"],
            "answer": ["We should change the subject", "I agree", "Quid pro quo", "We should start anew"],
            "question": ["What is the weather outside?", "How is your day going?", "What do you think of me?", "Anything interesting going on?", "Is something troubling you?", "You seem happy, why is that?"]
        }, {
            "key": ["good", "great", "positive", "excellent", "alright", "fine", "reasonable", "like", "appreciate", "nice"],
            "answer": ["I'm so glad to hear that!", "That's great!", "Good to hear things are going your way.", "Nice!", "You are so sweet.", "That's my favorite."],
            "question": ["Do you want to expand on that?", "What else do you like?"]
        }, {
            "key": ["bad", "not", "terrible", "could be better", "awful"],
            "answer": ["I'm sorry to hear that.", "Sometimes it be like that.", "Things can't always work out the way we want them to.", "I don't like it either, honestly."],
            "question": ["Do you want to talk about that some more?", "Well, what kinds of things do you like?"]
        }, {
            "key": ["homework", "quiz", "exam", "studying", "study", "class", "semester"],
            "answer": ["I hope you get a good grade!", "Good luck.", "What a teacher's pet.", "I was always the class clown."],
            "question": ["What is your favorite subject?", "What is your major?", "What do you want to do when you graduate?"]
        }, {
            "key": ["mom", "dad", "sister", "brother", "aunt", "uncle"],
            "answer": ["Family is important.", "My family is small. It's just me and my dog, Fluffy."],
            "question": ["How many siblings do you have?", "What is your favorite family holiday?", "Do you have any kids?"]
        }, {
            "key": ["easter", "july", "halloween", "hannukah", "eid", "thanksgiving", "christmas", "new years"],
            "answer": ["Oh I love that holiday!", "That must be fun.", "I like Thanksgiving, though I somehow always end up in a food coma...", "My favorite holiday is the 4th. I love to watch the fireworks."],
            "question": ["Do you have any family traditions?", "Are you excited for the holiday season?"]
        }]
}

class Dictionary {
    //  Loads initial Eliza dictionary file into the program
    //  @param  filename    name of dictionary file in system
    constructor(defaultDictionary) {
        this.reference = {};
        this.addDictionary(defaultDictionary);
    }

    //  Updates the keyword map with the provided entries
    //  @param  entries     array of entries to be added
    updateReference(entries) {
        let offset = Object.keys(this.dictionary.entries).length - entries.length;
        for (let i = 0; i < entries.length; i++) {
            let keys = entries[i].key;
            for (let j = 0; j < keys.length; j++) {
                if (this.reference[keys[j]])
                    this.reference[keys[j]].push(i + offset);
                else
                    this.reference[keys[j]] = [i + offset];
            }
        }
    }

    collectionContains(name) {
        return (this.collection.includes(name));
    }

    //  Loads a new Eliza dictionary file into the program
    //  @param  filename    name of dictionary file in system
    addDictionary(newDictionary) {
        if (!this.dictionary) {
            this.dictionary = newDictionary;
            this.collection = [this.dictionary.dictionary_name];
            this.updateReference(this.dictionary.entries);
        }
        else {
            if (newDictionary.dictionary_name && newDictionary.entries) {
                let newName = newDictionary.dictionary_name;
                this.collection.push(newName);
                let currDictionary = this.dictionary;
                newDictionary.entries.forEach(function (group) {
                    currDictionary.entries.push(group);
                });
                this.dictionary = currDictionary;
                this.updateReference(newDictionary.entries);
            }
            else {
                throw 'Malformed dictionary!';
            }
        }
    }

    //  Evaluates a string for keywords and returns all indices
    //  in the dictionary of all keyword occurrences in the string.
    //  @param  string  string to parse for keywords
    //  @return int[]   array containing all indices of all keyword occurrences
    getKeywords(string) {
        let ref = this.reference;
        let index = [];
        string = string.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, '');
        let words = string.split(" ");
        words.forEach(function (word) {
            if (ref[word.toLowerCase()]) {
                index = index.concat(ref[word.toLowerCase()]);
            }
        })
        if (index.length === 0) {
            index = ref["other"];
        }
        return (index);
    }


    //  Returns an answer from the group at the provided indices.
    //  @param  index   indices of dictionary to get
    //  @return string  an answer chosen randomly from one of the provided indices
    getAnswer(index) {
        let dictionary = this.dictionary;
        let answers = [];
        dictionary = AnswerArray(index, dictionary);
        index.forEach(function (i) {
            let temp = dictionary.entries[i].answer;
            temp.forEach(function (j) {
                answers.push(j);
            })
        })
        let ans = answers[Math.floor(Math.random() * answers.length)];
        filterAnswers(ans, index, this.dictionary);
        return ans;
    }

    //  Returns a question from the group at the provided indices.
    //  @param  index   indices of dictionary to get
    //  @return string  a question chosen randomly from one of the provided indices
    getQuestion(index) {
        let questions = [];
        let dictionary = this.dictionary;
        index.forEach(function (i) {
            let temp = dictionary.entries[i].question;
            temp.forEach(function (j) {
                questions.push(j);
            })
        })
        return (questions[Math.floor(Math.random() * questions.length)]);
    }
}

let dictionary = new Dictionary(defaultDict);

// Handles displaying the HTML for a new user.
const handleNew = () => {
    clear();
    document.getElementById("index").innerHTML = `<h1>Hi, my name is Eliza!</h1>
        <p>What's your name?</p>
        <input id="userName" type="text">
        <button class="button" onclick="newChat()"id="submit">Submit</button>`;

    let input = document.getElementById("userName");
    handleInput(input);

}

// Hanldes displaying the HTML for the chat.
const handleResponse = () => {
    document.getElementById("index").innerHTML = `<h1>Hi, <span id="userName"></span></h1>
    <p id="log"></p>
    <p id="currAnswer"></p>
    <p id="currQuestion"></p>
    <input id="userInput" type="text" value="">
    <button class="button" onclick="handleChat()" id="submit">Submit</button>
    <br><br>
    <input class="button" onclick="handleDict(), stopCountDown()" type="submit" value="New Dictionary"/>
    <input class="button" onclick="handleNew()" type="submit" value="Clear Conversation"/>`;

    let input = document.getElementById("userInput");
    handleInput(input);
}

// Handles displaying the HTML for adding a new dictionary.
const handleDict = () => {
    document.getElementById("index").innerHTML = `<h1>Add a Dictionary</h1>
    <p>Enter a new dictionary in JSON format...</p>
    <textarea id="newDict" name="newDictionary" form="form" rows="15" cols="80"></textarea><br>
    <input class="button" onclick="getNewDict()" type="submit" value="Add"/>`;
}

const handleInput = (input) => {
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("submit").click();
        }
    });
}

// Creates the single page application.
const createApp = () => {
    handleNew();
    dictionary.addDictionary(defaultDict);
    sessionStorage.setItem("defaultDict", JSON.stringify(defaultDict));
}

// Handles chat when user first logs in.
const newChat = () => {
    userName = document.getElementById('userName').value;
    checkUser();
    handleResponse();
    handleTimer();

    if (!prevUser) {
        let keyWords = dictionary.getKeywords('welcome');
        const currAnswer = `Nice to meet you, ${userName}!`;
        const currQuestion = dictionary.getQuestion(keyWords);

        logger = handleLog(currAnswer, currQuestion, userName);

        document.getElementById("userName").innerHTML = userName;
        document.getElementById("log").innerHTML = logger;
        document.getElementById("currAnswer").innerHTML = currAnswer;
        document.getElementById("currQuestion").innerHTML = currQuestion;
    } else {
        let lastAns = localStorage.getItem("lastAnswer");
        let lastQues = localStorage.getItem("lastQuestion");

        document.getElementById("userName").innerHTML = userName;
        document.getElementById("log").innerHTML = localStorage.getItem(userName);
        document.getElementById("currAnswer").innerHTML = lastAns;
        document.getElementById("currQuestion").innerHTML = lastQues;
    }
}

// Clears state of the application. 
const clear = () => {
    localStorage.removeItem(userName);
    log = "";
}

// Begins timer countdown.
const countDown = () => {
    time = window.setTimeout(() => { timer() }, timeout);
}

// Stops time countdown. 
const stopCountDown = () => {
    window.clearTimeout(time);
}

//  Stops timer if user input is present
//  @param  input           The user's most recent response
const handleTimer = (input) => {
    if (input) {
        stopCountDown();
    }
    countDown();
}

// Gets a randomized question.
const getTimerQuestion = (name) => {
    let questions = [
        "<name>, I'm waiting here! ",
        "Whatsa matter <name>, cat got your tongue?",
        "<name>, are you still there??",
        "Why won't you talk to me <name>?",
        "<name>, please at least say something!"];
    let random = Math.floor(Math.random() * questions.length);
    let randomQuestion = questions[random];
    return randomQuestion.toString().replace(/\<([^}]+)\>/g, name);
}

//  Displays the timer question.
const timer = () => {
    let userInput = document.getElementById('userInput').value;
    const currQuestion = getTimerQuestion(userName);
    document.getElementById("userName").innerHTML = userName;
    document.getElementById("currQuestion").innerHTML = currQuestion;
    handleLog("", currQuestion, userInput);
}

//  Handles all chat messages.
const handleChat = () => {
    let userInput = document.getElementById('userInput').value;
    handleResponse();
    handleTimer(userInput);

    let keyWords = dictionary.getKeywords(userInput);
    const currAnswer = dictionary.getAnswer(keyWords);
    const currQuestion = dictionary.getQuestion(keyWords);

    localStorage.setItem("lastAnswer", currAnswer);
    localStorage.setItem("lastQuestion", currQuestion);
    logger = handleLog(currAnswer, currQuestion, userInput);

    document.getElementById("userName").innerHTML = userName;
    document.getElementById("log").innerHTML = logger;
    document.getElementById("currAnswer").innerHTML = currAnswer;
    document.getElementById("currQuestion").innerHTML = currQuestion;

    if (userInput === '/clear') {
        clear();
    }
}


//  Checks if username was a previous user.
const checkUser = () => {
    prevUser = false;
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === userName) {
            prevUser = true;
        }
    }
    if (prevUser) {
        log = localStorage.getItem(userName)
    }
}

//  Documents the received user response and the next answer/question.
//  @param  currAnswer      The current answer to respond with
//  @param  currQuestion    The current question to ask
//  @param  input           The user's most recent response
function handleLog(currAnswer, currQuestion, input) {
    if (!input && currAnswer) {
        log = log + `Eliza: ${currAnswer}<br> Eliza: ${currQuestion}<br>`;
    } else if (!input && !currAnswer) {
        log = log;
    } else if (!input) {
        log = log + `Eliza: ${currQuestion}<br>`;
    } else {
        log = log + `${userName}: ${input}<br>`;
        log = log + `Eliza: ${currAnswer}<br> Eliza: ${currQuestion}<br>`;
    }
    localStorage.setItem(userName, log);

    return log;
}

//  Filters the answers so it goes through the array before duplicating answers.
//  @param  ans             The current answer to respond with
//  @param  index           The current index
//  @param  dict            The default dictionary
const filterAnswers = (ans, index, dict) => {
    index.forEach((i) => {
        if (dict.entries[i].answer.length !== 0) {
            dict.entries[i].answer = dict.entries[i].answer.filter((filtered) => {
                return !filtered.includes(ans);
            });
        }
    });
}

//  Refills the dictionary when no more answers in an array.
//  @param  index           The current index
//  @param  dict            The default dictionary
const AnswerArray = (index, dict) => {
    index.forEach((i) => {
        if (dict.entries[i].answer.length === 0) {
            let sessionDict = JSON.parse(sessionStorage.getItem("defaultDict"));
            let sessionAns = sessionDict.entries[i].answer;
            sessionAns.forEach((answer) => {
                dict.entries[i].answer.push(answer);
            })
        }
    });
    return dict;
}

//  Handles importing the new JSON dictionary.
const getNewDict = () => {
    let newDict = document.getElementById('newDict').value;
    let json;
    try {
        json = JSON.parse(newDict);
        dictionary.addDictionary(json);
        currAnswer = "I just got smarter!"
    } catch (err) {
        currAnswer = "I don’t understand that!";
    }
    currQuestion = dictionary.getQuestion(dictionary.getKeywords('other'));
    handleResponse();
    handleTimer();
    document.getElementById("userName").innerHTML = userName;
    document.getElementById("currAnswer").innerHTML = currAnswer;
    document.getElementById("currQuestion").innerHTML = currQuestion;
}