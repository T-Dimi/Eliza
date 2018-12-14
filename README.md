# Eliza Application


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

* Web Browser

## Steps to run the program
* `> cd Eliza`
* `> click index.html`


### Features
* This Single Page Application (SPA) implements the classic Eliza algorithm. 
* Eliza is a mock Rogerian psychotherapist. It prompts for user input, and uses a simple transformation algorithm to change user input into a follow-up question. The program is designed to give the appearance of understanding.
* Add Custom JSON file to train Eliza

### Supported JSON structure to train Eliza
    { "dictionary_name" : <Name of the dictionary>,

      "entries":

      [{

        "key": <Array of the keywords>,

        "answer": <Array of the string>,

        "question": <Array of the string>

        }]

    }



## Authors: 
* **Thomas Dimitriadis**
