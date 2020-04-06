import * as React from 'react';
import ArticleList from './ArticleList'
import './App.css'
import { useParams } from 'react-router-dom';

const App = () => {
  let { id } = useParams();

  return (
    < div >
      <ArticleList id={id} />
    </div >
  );
}

export default App