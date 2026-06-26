import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchQuizzes } from '../store/quizSlice';
import { fetchQuestions } from '../store/questionSlice';

const AdminHome = () => {
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quizzes.list);
  const questions = useSelector((state) => state.questions.list);
  const articles = useSelector((state) => state.articles.list);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchQuestions());
  }, [dispatch]);

  return (
    <div className="container py-4">
      
     

    
     

     
    </div>
  );
};

export default AdminHome;
