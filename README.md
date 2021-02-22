# Purpose of this app
To help me study for my cyber security quiz

# What is this app doing
It is running a flask script that runs rust code that was complied to base c. The rust code opens a csv, containing the questions and thier respective answers (see example.csv in /api) and converts it to json (a readable format for react). It then sends the json to react through flask and react handles the display logic to show the flash cards.

# Why 
I wanted to learn more about rust and implementing it in a web application. I also needed to study for my cyber security quiz. Many of the online flash card builders do not support multi choice questions, so I built one myself.

# App start
1. npm run start-api (You need python 3.9 in your home C:\)
2. npm run start

# Example
![](React_App_Using_Flask_And_Rust.gif)

# Lessons learned
Cannot use wasm for this application. I attempted to integrate rust in with wasm_bindgen. File operations in wasm in rust are not supported. Attempting to do so will raise the error, “operation not supported.” Therefore, the next best step was to use flask!

React hooks are cool!

