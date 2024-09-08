import React from 'react';
import { Link } from 'react-router-dom';

const BeginnersGuide = () => {
  return (
    <div className="p-8 w-11/12 mx-auto font-sans text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Prompt Mastery: A Beginner’s Guide to Writing Effective Prompts
      </h1>
      <p className="text-lg text-center mb-8">Get started with creating powerful AI prompts effortlessly!</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. What is a Prompt?</h2>
        <p className="mb-4">
          A prompt is a short instruction or input given to an AI model to generate responses or perform specific tasks. Think of it as the question or request you give to the AI to get the desired result.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Why Writing Good Prompts Matters</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Precision</strong>: Clear, specific prompts lead to more accurate responses.</li>
          <li><strong>Efficiency</strong>: Well-structured prompts save time by reducing back-and-forth.</li>
          <li><strong>Creativity</strong>: The right wording can unlock more creative responses from the AI.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Basic Tips for Writing Effective Prompts</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Be Specific:</strong> Always state exactly what you want to know or do.</li>
          <li><strong>Set Context:</strong> Provide necessary background or set parameters for better results.</li>
          <li><strong>Experiment & Iterate:</strong> Don’t hesitate to refine your prompts if the initial results aren’t what you expect.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Free Resources for Learning Prompt Writing</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><Link to="https://youtu.be/_ZvnD73m40o?si=YVXAniOH0_Rco6yZ" target="_blank" className="text-blue-600 underline">Intro to Prompt Engineering - YouTube <i className='fi fi-rr-link text-sm'></i></Link></li>
          <li><Link to="https://learnprompting.org" className="text-blue-600 underline" target="_blank">LearnPrompting.org <i className='fi fi-rr-link text-sm'></i></Link></li>
          <li><Link to="https://github.com/dair-ai/Prompt-Engineering-Guide" target="_blank" className="text-blue-600 underline">Prompt Engineering Guide <i className='fi fi-rr-link text-sm'></i></Link></li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Quick Exercises to Get You Started</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Exercise 1:</strong> "Describe the plot of a popular movie in 2 sentences."</li>
          <li><strong>Exercise 2:</strong> "Explain how to bake a cake as if you're talking to someone who has never cooked before."</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Common Mistakes to Avoid</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Vagueness: Make sure your instructions are clear and not too open-ended.</li>
          <li>Too Much Complexity: Start simple before diving into complex multi-step tasks.</li>
          <li>Ignoring the AI’s Capabilities: Know the strengths and limits of the AI you're working with.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Still Need Help?</h2>
        <p>
          Check out our <strong>Prompt Templates</strong> (coming soon) for ready-to-use examples, and join <strong>Prompt IQ</strong> to ask questions and learn from others.
        </p>
      </section>

      <p className="text-center">
        Ready to practice? Head back to <Link to="/" className="hover:underline">Prompt IQ</Link> and start crafting your prompts!
      </p>
    </div>
  );
};

export default BeginnersGuide;