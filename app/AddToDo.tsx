"use client";

import { useState } from 'react';
import supabase from '../app/lib/supabaseClient'; 
import { useRouter } from 'next/navigation';

const AddTodo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddTodo = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }
    setError(null); // Reset error
    const { error } = await supabase
      .from('todos')
      .insert([{ title, description }]);

    if (error) {
      console.error('Error adding todo:', error);
      setError('Error adding todo');
    } else {
      setTitle('');
      setDescription('');
      router.push('/');
    }
  };

  return (
    <div className='w-full max-w-md p-4 bg-gray-700 rounded-lg mb-4'>
      <h1 className='text-xl font-semibold mb-4'>Add To-Do</h1>
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
        className='block w-full p-2 mb-4 border rounded'
      />
      <button
        onClick={handleAddTodo}
        className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        Add Todo
      </button>
    </div>
  );
};

export default AddTodo;
