import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTrash } from 'react-icons/fa';
import '../App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [activeTag, setActiveTag] = useState('all');

    const getTasksFromLocalStorage = () => {
        const tasksToDisplay = [];
        let n = 1;
        let taskKey = 'task' + n;
        while (localStorage.getItem(taskKey)) {
            const taskData = JSON.parse(localStorage.getItem(taskKey));
            tasksToDisplay.push(taskData);
            n++;
            taskKey = 'task' + n;
        }
        return tasksToDisplay;
    };

    useEffect(() => {
        const tasksToDisplay = getTasksFromLocalStorage();
        if (tasksToDisplay.length > 0) {
            setTasks(tasksToDisplay);
        }
    }, []);

    useEffect(() => {
        localStorage.clear();
        tasks.forEach((task, index) => {
            const taskKey = 'task' + (index + 1);
            localStorage.setItem(taskKey, JSON.stringify(task));
        });
    }, [tasks]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddTask = () => {
        if (inputValue.trim() !== '') {
            const newTask = {
                id: Date.now(),
                text: inputValue,
                completed: false,
            };
            let taskIndex = tasks.length + 1;
            const taskKey = 'task' + taskIndex;
            localStorage.setItem(taskKey, JSON.stringify(newTask));
            setTasks([...tasks, newTask]);
            setInputValue('');
        }
    };

    const handleCompleteTask = (taskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed,
                };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const handleDeleteTask = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        localStorage.clear();
        updatedTasks.forEach((task, index) => {
            const taskKey = 'task' + (index + 1);
            localStorage.setItem(taskKey, JSON.stringify(task));
        });
    };

    const handleDeleteAllTasks = () => {
        setTasks([]);
        localStorage.clear();
    };

    const filteredTasks = tasks.filter((task) => {
        if (activeTag === 'active') {
            return !task.completed;
        } else if (activeTag === 'complete') {
            return task.completed;
        }
        return true;
    });

    return (
        <div className="app">
            <h1>Todo App</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter a task"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button onClick={handleAddTask}>Add</button>
            </div>
            <div className="tag-container">
                <span
                    className={activeTag === 'all' ? 'active' : ''}
                    onClick={() => setActiveTag('all')}
                >
                    All
                </span>
                <span
                    className={activeTag === 'active' ? 'active' : ''}
                    onClick={() => setActiveTag('active')}
                >
                    Active
                </span>
                <span
                    className={activeTag === 'complete' ? 'active' : ''}
                    onClick={() => setActiveTag('complete')}
                >
                    Complete
                </span>
            </div>
            <ul className="task-list">
                {filteredTasks.map((task) => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                        <span
                            className="task-text"
                            onClick={() => handleCompleteTask(task.id)}
                        >
                            {task.text}
                        </span>
                        <FaTrash
                            className="delete-icon"
                            onClick={() => handleDeleteTask(task.id)}
                        />
                    </li>
                ))}
            </ul>
            <button className="delete-all-button" onClick={handleDeleteAllTasks}>
                Delete All
            </button>
        </div>
    );
};

export default App;
