import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import getRandomIntInRange from './functions/randomizers';

class App extends Component {
  constructor() {
    super();

    this.state = {
      firstWord: '',
      wordCount: 0,
      story: '',
      currentCount: 0
    };
  }

  handleWordInput = (e) => {
    const firstWord = e.target.value;
    this.setState({
      firstWord
    });
  }

  handleCountInput = (e) => {
    const wordCount = e.target.value;
    this.setState({
      wordCount
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.setState({
      story: this.state.firstWord + ' ',
      currentCount: 1
    },
      () => {
        this.getRelatedWords(this.state.firstWord);
      }
    );
  }

  getRelatedWords = (word) => {
    axios({
      url: `https://api.datamuse.com/words?rel_bga=${word}`,
      method: 'GET',
      responseType: 'json',
    }).then((response) => {
      // console.log(response.data);
      if (response.data.length > 0) {
        let randomIndex = getRandomIntInRange(0, response.data.length - 1);
        let newWord = response.data[randomIndex].word;
        // console.log(newWord);
        while (newWord === undefined || newWord === '.') {
          randomIndex = getRandomIntInRange(0, response.data.length - 1);
          newWord = response.data[randomIndex].word;
        }
        let storySoFar = this.state.story;
        storySoFar += `${newWord} `;
        this.setState({
          story: storySoFar,
          currentCount: this.state.currentCount + 1
        },
          () => {
            if (this.state.currentCount < this.state.wordCount) {
              this.getRelatedWords(newWord);
            }
          }
        );
      } else {
        this.setState({
          story: this.state.story + '.'
        });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <h1>RoboBard</h1>
        <form onSubmit={this.handleFormSubmit}>
          <label htmlFor="firstWord">Choose the first word:</label>
          <input onChange={this.handleWordInput} type="text" id="firstWord" name="firstWord" />
          <label htmlFor="wordCount">Max words?</label>
          <input onChange={this.handleCountInput} type="number" id="wordCount" name="wordCount" min="1" />
          <button type="submit">Begin</button>
        </form>
        <p>{this.state.story}</p>
      </div>
    );
  }
}

export default App;
