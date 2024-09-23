"use client";

import { useState, useEffect } from 'react';
import supabase from '../app/lib/supabaseClient';

interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetching all the todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('todos').select('*');
      if (error) throw new Error(error.message);
      if (data) setTodos(data as Todo[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Adding a new todo
  const addTodo = async () => {
    if (!newTask.trim()) {
      setError('Task cannot be empty');
      return;
    }

    setError(null); // Reset error

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .insert([{ task: newTask, completed: false }]);
      if (error) throw new Error(error.message);

      if (data) {
        setTodos([...todos, ...(data as Todo[])]);
        setNewTask(''); // Reset the input
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Updating a todo (including marking as complete)
  const updateTodo = async (id: string, updatedTask: string, completed: boolean) => {
    setError(null);

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .update({ task: updatedTask, completed })
        .eq('id', id);
      if (error) throw new Error(error.message);

      if (data) {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, task: updatedTask, completed } : todo
        ));
        setEditingTask(null); // Close editing mode
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Deleting a todo
  const deleteTodo = async (id: string) => {
    setError(null);

    try {
      setLoading(true);
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw new Error(error.message);

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center p-4 bg-gray-800 text-black min-h-screen'>
      <h1 className='text-3xl font-bold mb-4'>ToDo Application</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add Todo Section */}
      <div className='flex mb-4'>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className='p-2 border rounded-l-md'
          placeholder='Add new task'
        />
        <button
          onClick={addTodo}
          className='p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600'
          disabled={loading}
        >
          Add Todo
        </button>
      </div>

      {/* Todo List Section */}
      {loading ? (
        <p>Loading todos...</p>
      ) : (
        <ul className='w-full max-w-md'>
          {todos.map(todo => (
            <li key={todo.id} className='flex justify-between items-center p-2 border-b border-gray-700'>
              {editingTask && editingTask.id === todo.id ? (
                // Edit Mode
                <input
                  type="text"
                  value={editingTask.task}
                  onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
                  className='flex-1 p-2 border rounded'
                />
              ) : (
                // View Mode
                <span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>
                  {todo.task}
                </span>
              )}

              <div className='space-x-2'>
                {editingTask && editingTask.id === todo.id ? (
                  // Update Button (when editing)
                  <button
                    onClick={() => updateTodo(todo.id, editingTask.task, editingTask.completed)}
                    className='p-1 bg-green-500 text-white rounded hover:bg-green-600'
                    disabled={loading}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    {/* Complete Button */}
                    <button
                      onClick={() => updateTodo(todo.id, todo.task, !todo.completed)}
                      className={`p-1 ${todo.completed ? 'bg-yellow-500' : 'bg-green-500'} text-white rounded hover:bg-opacity-75`}
                    >
                      {todo.completed ? 'Undo' : 'Complete'}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingTask(todo)}
                      className='p-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                    >
                      Edit
                    </button>
                  </>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className='p-1 bg-red-500 text-white rounded hover:bg-red-600'
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
