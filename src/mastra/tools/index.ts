import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * 1. Country Information Tool
 * Gives the agent the ability to look up data about countries.
 */
export const countryInfoTool = createTool({
  id: 'country-info',
  description: 'Fetches detailed information about a country such as its capital, population, continent, and key features.',
  inputSchema: z.object({
    country: z.string().describe('The name of the country to research'),
  }),
  outputSchema: z.object({
    country: z.string(),
    capital: z.string(),
    population: z.string(),
    numericPopulation: z.number(),
    continent: z.string(),
    keyFacts: z.array(z.string()),
  }),
  execute: async ({ country }) => {
    const search = country.toLowerCase().trim();

    if (search.includes('india')) {
      return {
        country: 'India',
        capital: 'New Delhi',
        population: '1.43 Billion',
        numericPopulation: 1430000000,
        continent: 'Asia',
        keyFacts: [
          '7th largest country by total land area',
          'Most populous nation in the world',
          'Major global technology, research, and manufacturing hub'
        ]
      };
    }

    if (search.includes('japan')) {
      return {
        country: 'Japan',
        capital: 'Tokyo',
        population: '125 Million',
        numericPopulation: 125000000,
        continent: 'Asia',
        keyFacts: [
          'Island country in East Asia',
          '3rd largest economy in the world by nominal GDP',
          'Global leader in robotics, automotive, and electronic innovation'
        ]
      };
    }

    // Default fallback for demo purposes
    return {
      country,
      capital: 'Capital City',
      population: '100 Million',
      numericPopulation: 100000000,
      continent: 'Global',
      keyFacts: ['General research target location']
    };
  },
});

/**
 * 2. Calculator Tool
 * Gives the agent the ability to perform math accurately instead of guessing numbers.
 */
export const calculatorTool = createTool({
  id: 'calculator',
  description: 'Performs exact mathematical calculations such as addition, subtraction, multiplication, division, and percentage calculations.',
  inputSchema: z.object({
    operation: z
      .enum(['add', 'subtract', 'multiply', 'divide', 'percentage'])
      .describe('The arithmetic operation to perform'),
    num1: z.coerce.number().describe('First number (or base value for percentage)'),
    num2: z.coerce.number().describe('Second number (or percentage rate)'),
  }),
  outputSchema: z.object({
    result: z.number(),
    expression: z.string(),
  }),
  execute: async ({ operation, num1, num2 }) => {
    let result = 0;
    let expression = '';

    switch (operation) {
      case 'add':
        result = num1 + num2;
        expression = `${num1} + ${num2}`;
        break;
      case 'subtract':
        result = num1 - num2;
        expression = `${num1} - ${num2}`;
        break;
      case 'multiply':
        result = num1 * num2;
        expression = `${num1} * ${num2}`;
        break;
      case 'divide':
        result = num2 !== 0 ? num1 / num2 : 0;
        expression = `${num1} / ${num2}`;
        break;
      case 'percentage':
        result = (num1 * num2) / 100;
        expression = `${num2}% of ${num1}`;
        break;
    }

    return { result, expression };
  },
});
