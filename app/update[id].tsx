"use client";

import { useState, useEffect } from 'react';
import supabase from '../app/lib/supabaseClient'; 
import { useRouter } from 'next/navigation';

export default function EditTodo({ params: { id } }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTodo = async () => {
      const { data: todo, error } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError('Error fetching todo');
      } else if (todo) {
        setTitle(todo.task);
        setDescription(todo.description || '');
        setIsComplete(todo.completed);
      }
    };
    fetchTodo();
  }, [id]);

  const handleUpdateTodo = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }
    const { error } = await supabase
      .from('todos')
      .update({ task: title, description, completed: isComplete })
      .eq('id', id);

    if (error) {
      console.error('Error updating todo:', error);
      setError('Error updating todo');
    } else {
      router.push('/');
    }
  };

  return (
    <div className='w-full max-w-md p-4 bg-gray-700 rounded-lg'>
      <h1 className='text-xl font-semibold mb-4'>Edit To-Do</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='block w-full p-2 mb-2 border rounded'
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='block w-full p-2 mb-2 border rounded'
      />
      <label className='flex items-center mb-4'>
        <input
          type="checkbox"
          checked={isComplete}
          onChange={() => setIsComplete(!isComplete)}
          className='mr-2'
        />
        Completed
      </label>
      <button
        onClick={handleUpdateTodo}
        className='w-full p-2 bg-green-500 text-white rounded hover:bg-green-600'
      >
        Update Todo
      </button>
    </div>
  );
}
