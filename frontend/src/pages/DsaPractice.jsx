import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code, CheckSquare, Square, Flame, Loader2, Sparkles, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DsaPractice = () => {
  const { user, refreshProfile } = useAuth();
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const problemsBank = {
    'Arrays': [
      { id: 'arr1', name: 'Two Sum', difficulty: 'Easy' },
      { id: 'arr2', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy' },
      { id: 'arr3', name: 'Majority Element', difficulty: 'Easy' },
      { id: 'arr4', name: 'Contains Duplicate', difficulty: 'Easy' },
      { id: 'arr5', name: 'Missing Number', difficulty: 'Easy' },
      { id: 'arr6', name: 'Move Zeroes', difficulty: 'Easy' },
      { id: 'arr7', name: 'Merge Sorted Array', difficulty: 'Easy' },
      { id: 'arr8', name: 'Find All Numbers Disappeared in an Array', difficulty: 'Easy' },
      { id: 'arr9', name: 'Squares of a Sorted Array', difficulty: 'Easy' },
      { id: 'arr10', name: 'Remove Duplicates from Sorted Array', difficulty: 'Easy' },
      { id: 'arr11', name: '3Sum', difficulty: 'Medium' },
      { id: 'arr12', name: 'Container With Most Water', difficulty: 'Medium' },
      { id: 'arr13', name: 'Merge Intervals', difficulty: 'Medium' },
      { id: 'arr14', name: 'Product of Array Except Self', difficulty: 'Medium' },
      { id: 'arr15', name: 'Find the Duplicate Number', difficulty: 'Medium' },
      { id: 'arr16', name: 'Subarray Sum Equals K', difficulty: 'Medium' },
      { id: 'arr17', name: 'Next Permutation', difficulty: 'Medium' },
      { id: 'arr18', name: 'Rotate Array', difficulty: 'Medium' },
      { id: 'arr19', name: 'Maximum Subarray', difficulty: 'Medium' },
      { id: 'arr20', name: 'Spiral Matrix', difficulty: 'Medium' },
      { id: 'arr21', name: 'Search in Rotated Sorted Array', difficulty: 'Medium' },
      { id: 'arr22', name: 'Non-overlapping Intervals', difficulty: 'Medium' },
      { id: 'arr23', name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium' },
      { id: 'arr24', name: 'Contiguous Array', difficulty: 'Medium' },
      { id: 'arr25', name: '3Sum Closest', difficulty: 'Medium' },
      { id: 'arr26', name: 'First Missing Positive', difficulty: 'Hard' },
      { id: 'arr27', name: 'Sliding Window Maximum', difficulty: 'Hard' },
      { id: 'arr28', name: 'Largest Rectangle in Histogram', difficulty: 'Hard' },
      { id: 'arr29', name: 'Trapping Rain Water', difficulty: 'Hard' },
      { id: 'arr30', name: 'Max Chunks To Make Sorted II', difficulty: 'Hard' }
    ],
    'Strings': [
      { id: 'str1', name: 'Valid Palindrome', difficulty: 'Easy' },
      { id: 'str2', name: 'Valid Anagram', difficulty: 'Easy' },
      { id: 'str3', name: 'Longest Common Prefix', difficulty: 'Easy' },
      { id: 'str4', name: 'First Unique Character in a String', difficulty: 'Easy' },
      { id: 'str5', name: 'Implement strStr()', difficulty: 'Easy' },
      { id: 'str6', name: 'Reverse String', difficulty: 'Easy' },
      { id: 'str7', name: 'Is Subsequence', difficulty: 'Easy' },
      { id: 'str8', name: 'Length of Last Word', difficulty: 'Easy' },
      { id: 'str9', name: 'Valid Palindrome II', difficulty: 'Easy' },
      { id: 'str10', name: 'Word Pattern', difficulty: 'Easy' },
      { id: 'str11', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' },
      { id: 'str12', name: 'Group Anagrams', difficulty: 'Medium' },
      { id: 'str13', name: 'Longest Palindromic Substring', difficulty: 'Medium' },
      { id: 'str14', name: 'String to Integer (atoi)', difficulty: 'Medium' },
      { id: 'str15', name: 'Decode String', difficulty: 'Medium' },
      { id: 'str16', name: 'Find All Anagrams in a String', difficulty: 'Medium' },
      { id: 'str17', name: 'Custom Sort String', difficulty: 'Medium' },
      { id: 'str18', name: 'Basic Calculator II', difficulty: 'Medium' },
      { id: 'str19', name: 'Repeated String Match', difficulty: 'Medium' },
      { id: 'str20', name: 'Palindromic Substrings', difficulty: 'Medium' },
      { id: 'str21', name: 'Multiply Strings', difficulty: 'Medium' },
      { id: 'str22', name: 'Simplify Path', difficulty: 'Medium' },
      { id: 'str23', name: 'Longest Repeating Character Replacement', difficulty: 'Medium' },
      { id: 'str24', name: 'Minimum Deletion Cost to Avoid Repeating Letters', difficulty: 'Medium' },
      { id: 'str25', name: 'Generate Parentheses', difficulty: 'Medium' },
      { id: 'str26', name: 'Minimum Window Substring', difficulty: 'Hard' },
      { id: 'str27', name: 'Text Justification', difficulty: 'Hard' },
      { id: 'str28', name: 'Edit Distance', difficulty: 'Hard' },
      { id: 'str29', name: 'Distinct Subsequences', difficulty: 'Hard' },
      { id: 'str30', name: 'Orderly Queue', difficulty: 'Hard' }
    ],
    'Linked List': [
      { id: 'll1', name: 'Reverse Linked List', difficulty: 'Easy' },
      { id: 'll2', name: 'Merge Two Sorted Lists', difficulty: 'Easy' },
      { id: 'll3', name: 'Linked List Cycle', difficulty: 'Easy' },
      { id: 'll4', name: 'Middle of the Linked List', difficulty: 'Easy' },
      { id: 'll5', name: 'Remove Duplicates from Sorted List', difficulty: 'Easy' },
      { id: 'll6', name: 'Intersection of Two Linked Lists', difficulty: 'Easy' },
      { id: 'll7', name: 'Palindrome Linked List', difficulty: 'Easy' },
      { id: 'll8', name: 'Remove Linked List Elements', difficulty: 'Easy' },
      { id: 'll9', name: 'Delete Node in a Linked List', difficulty: 'Easy' },
      { id: 'll10', name: 'Convert Binary Number in a Linked List to Integer', difficulty: 'Easy' },
      { id: 'll11', name: 'Remove Nth Node From End of List', difficulty: 'Medium' },
      { id: 'll12', name: 'Linked List Cycle II', difficulty: 'Medium' },
      { id: 'll13', name: 'Add Two Numbers', difficulty: 'Medium' },
      { id: 'll14', name: 'Copy List with Random Pointer', difficulty: 'Medium' },
      { id: 'll15', name: 'Swap Nodes in Pairs', difficulty: 'Medium' },
      { id: 'll16', name: 'Odd Even Linked List', difficulty: 'Medium' },
      { id: 'll17', name: 'Sort List', difficulty: 'Medium' },
      { id: 'll18', name: 'Reorder List', difficulty: 'Medium' },
      { id: 'll19', name: 'Partition List', difficulty: 'Medium' },
      { id: 'll20', name: 'Rotate List', difficulty: 'Medium' },
      { id: 'll21', name: 'Design Circular Deque', difficulty: 'Medium' },
      { id: 'll22', name: 'Next Greater Node In Linked List', difficulty: 'Medium' },
      { id: 'll23', name: 'Split Linked List in Parts', difficulty: 'Medium' },
      { id: 'll24', name: 'Flatten a Multilevel Doubly Linked List', difficulty: 'Medium' },
      { id: 'll25', name: 'Insertion Sort List', difficulty: 'Medium' },
      { id: 'll26', name: 'Merge k Sorted Lists', difficulty: 'Hard' },
      { id: 'll27', name: 'Reverse Nodes in k-Group', difficulty: 'Hard' },
      { id: 'll28', name: 'Linked List in Binary Tree', difficulty: 'Medium' },
      { id: 'll29', name: 'All O`one Data Structure', difficulty: 'Hard' },
      { id: 'll30', name: 'LFU Cache', difficulty: 'Hard' }
    ],
    'Stack': [
      { id: 'st1', name: 'Valid Parentheses', difficulty: 'Easy' },
      { id: 'st2', name: 'Min Stack', difficulty: 'Easy' },
      { id: 'st3', name: 'Implement Queue using Stacks', difficulty: 'Easy' },
      { id: 'st4', name: 'Backspace String Compare', difficulty: 'Easy' },
      { id: 'st5', name: 'Remove All Adjacent Duplicates In String', difficulty: 'Easy' },
      { id: 'st6', name: 'Baseball Game', difficulty: 'Easy' },
      { id: 'st7', name: 'Next Greater Element I', difficulty: 'Easy' },
      { id: 'st8', name: 'Make The String Great', difficulty: 'Easy' },
      { id: 'st9', name: 'Crawler Log Folder', difficulty: 'Easy' },
      { id: 'st10', name: 'Final Prices With a Special Discount in a Shop', difficulty: 'Easy' },
      { id: 'st11', name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium' },
      { id: 'st12', name: 'Generate Parentheses', difficulty: 'Medium' },
      { id: 'st13', name: 'Daily Temperatures', difficulty: 'Medium' },
      { id: 'st14', name: 'Next Greater Element II', difficulty: 'Medium' },
      { id: 'st15', name: 'Online Stock Span', difficulty: 'Medium' },
      { id: 'st16', name: 'Decode String', difficulty: 'Medium' },
      { id: 'st17', name: 'Asteroid Collision', difficulty: 'Medium' },
      { id: 'st18', name: 'Exclusive Time of Functions', difficulty: 'Medium' },
      { id: 'st19', name: 'Simplify Path', difficulty: 'Medium' },
      { id: 'st20', name: 'Score of Parentheses', difficulty: 'Medium' },
      { id: 'st21', name: 'Remove Duplicate Letters', difficulty: 'Medium' },
      { id: 'st22', name: 'Validate Stack Sequences', difficulty: 'Medium' },
      { id: 'st23', name: 'Minimum Remove to Make Valid Parentheses', difficulty: 'Medium' },
      { id: 'st24', name: 'Next Greater Node In Linked List', difficulty: 'Medium' },
      { id: 'st25', name: 'Minimum Add to Make Parentheses Valid', difficulty: 'Medium' },
      { id: 'st26', name: 'Largest Rectangle in Histogram', difficulty: 'Hard' },
      { id: 'st27', name: 'Maximal Rectangle', difficulty: 'Hard' },
      { id: 'st28', name: 'Basic Calculator', difficulty: 'Hard' },
      { id: 'st29', name: 'Create Maximum Number', difficulty: 'Hard' },
      { id: 'st30', name: 'Trapping Rain Water', difficulty: 'Hard' }
    ],
    'Queue': [
      { id: 'qu1', name: 'Implement Stack using Queues', difficulty: 'Easy' },
      { id: 'qu2', name: 'Number of Recent Calls', difficulty: 'Easy' },
      { id: 'qu3', name: 'Time Needed to Buy Tickets', difficulty: 'Easy' },
      { id: 'qu4', name: 'First Unique Character in a String', difficulty: 'Easy' },
      { id: 'qu5', name: 'Find Winner on a Tic Tac Toe Game', difficulty: 'Easy' },
      { id: 'qu6', name: 'Moving Average from Data Stream', difficulty: 'Easy' },
      { id: 'qu7', name: 'Design Circular Queue', difficulty: 'Medium' },
      { id: 'qu8', name: 'Design Circular Deque', difficulty: 'Medium' },
      { id: 'qu9', name: 'Design Front Middle Back Queue', difficulty: 'Medium' },
      { id: 'qu10', name: 'Reveal Cards In Increasing Order', difficulty: 'Medium' },
      { id: 'qu11', name: 'Task Scheduler', difficulty: 'Medium' },
      { id: 'qu12', name: 'DOTA2 Senate', difficulty: 'Medium' },
      { id: 'qu13', name: 'Find the Winner of the Circular Game', difficulty: 'Medium' },
      { id: 'qu14', name: 'Product of the Last K Numbers', difficulty: 'Medium' },
      { id: 'qu15', name: 'Shortest Subarray with Sum at Least K', difficulty: 'Hard' },
      { id: 'qu16', name: 'Sliding Window Maximum', difficulty: 'Hard' },
      { id: 'qu17', name: 'Jump Game VI', difficulty: 'Medium' },
      { id: 'qu18', name: 'Constrained Subarray Sum', difficulty: 'Hard' },
      { id: 'qu19', name: 'Stamping The Sequence', difficulty: 'Hard' },
      { id: 'qu20', name: 'Number of Atoms', difficulty: 'Hard' },
      { id: 'qu21', name: 'Design Snake Game', difficulty: 'Medium' },
      { id: 'qu22', name: 'Parallel Courses III', difficulty: 'Hard' },
      { id: 'qu23', name: 'Maximum Sum Circular Subarray', difficulty: 'Medium' },
      { id: 'qu24', name: 'First Unique Number', difficulty: 'Medium' },
      { id: 'qu25', name: 'Deliver Messages', difficulty: 'Medium' },
      { id: 'qu26', name: 'Max Value of Equation', difficulty: 'Hard' },
      { id: 'qu27', name: 'Maximum Frequency Stack', difficulty: 'Hard' },
      { id: 'qu28', name: 'Ring and Rods', difficulty: 'Easy' },
      { id: 'qu29', name: 'Circular Array Loop', difficulty: 'Medium' },
      { id: 'qu30', name: 'Design Log Storage System', difficulty: 'Medium' }
    ],
    'Trees': [
      { id: 'tr1', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy' },
      { id: 'tr2', name: 'Invert Binary Tree', difficulty: 'Easy' },
      { id: 'tr3', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium' },
      { id: 'tr4', name: 'Path Sum', difficulty: 'Easy' },
      { id: 'tr5', name: 'Same Tree', difficulty: 'Easy' },
      { id: 'tr6', name: 'Symmetric Tree', difficulty: 'Easy' },
      { id: 'tr7', name: 'Balanced Binary Tree', difficulty: 'Easy' },
      { id: 'tr8', name: 'Subtree of Another Tree', difficulty: 'Easy' },
      { id: 'tr9', name: 'Minimum Depth of Binary Tree', difficulty: 'Easy' },
      { id: 'tr10', name: 'Sum of Left Leaves', difficulty: 'Easy' },
      { id: 'tr11', name: 'Binary Tree Paths', difficulty: 'Easy' },
      { id: 'tr12', name: 'Inorder Traversal', difficulty: 'Easy' },
      { id: 'tr13', name: 'Preorder Traversal', difficulty: 'Easy' },
      { id: 'tr14', name: 'Postorder Traversal', difficulty: 'Easy' },
      { id: 'tr15', name: 'Leaf-Similar Trees', difficulty: 'Easy' },
      { id: 'tr16', name: 'Root Equals Sum of Children', difficulty: 'Easy' },
      { id: 'tr17', name: 'Average of Levels in Binary Tree', difficulty: 'Easy' },
      { id: 'tr18', name: 'Cousins in Binary Tree', difficulty: 'Easy' },
      { id: 'tr19', name: 'Univalued Binary Tree', difficulty: 'Easy' },
      { id: 'tr20', name: 'Evaluate Boolean Binary Tree', difficulty: 'Easy' },
      { id: 'tr21', name: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium' },
      { id: 'tr22', name: 'Path Sum II', difficulty: 'Medium' },
      { id: 'tr23', name: 'Binary Tree Right Side View', difficulty: 'Medium' },
      { id: 'tr24', name: 'Count Complete Tree Nodes', difficulty: 'Medium' },
      { id: 'tr25', name: 'Find Bottom Left Tree Value', difficulty: 'Medium' },
      { id: 'tr26', name: 'Sum Root to Leaf Numbers', difficulty: 'Medium' },
      { id: 'tr27', name: 'Populating Next Right Pointers in Each Node', difficulty: 'Medium' },
      { id: 'tr28', name: 'Binary Tree Maximum Path Sum', difficulty: 'Hard' },
      { id: 'tr29', name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard' },
      { id: 'tr30', name: 'Vertical Order Traversal of a Binary Tree', difficulty: 'Hard' }
    ],
    'Binary Trees': [
      { id: 'bt1', name: 'Diameter of Binary Tree', difficulty: 'Easy' },
      { id: 'bt2', name: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium' },
      { id: 'bt3', name: 'Merge Two Binary Trees', difficulty: 'Easy' },
      { id: 'bt4', name: 'Tree Tilt', difficulty: 'Easy' },
      { id: 'bt5', name: 'Construct String from Binary Tree', difficulty: 'Easy' },
      { id: 'bt6', name: 'Smallest String Starting From Leaf', difficulty: 'Medium' },
      { id: 'bt7', name: 'Lowest Common Ancestor of Deepest Leaves', difficulty: 'Medium' },
      { id: 'bt8', name: 'Check Completeness of a Binary Tree', difficulty: 'Medium' },
      { id: 'bt9', name: 'Flip Equivalent Binary Trees', difficulty: 'Medium' },
      { id: 'bt10', name: 'Insert Row to Tree', difficulty: 'Medium' },
      { id: 'bt11', name: 'Maximum Width of Binary Tree', difficulty: 'Medium' },
      { id: 'bt12', name: 'Flatten Binary Tree to Linked List', difficulty: 'Medium' },
      { id: 'bt13', name: 'Step-By-Step Directions From a Binary Tree Node to Another', difficulty: 'Medium' },
      { id: 'bt14', name: 'Linked List in Binary Tree', difficulty: 'Medium' },
      { id: 'bt15', name: 'Delete Nodes And Return Forest', difficulty: 'Medium' },
      { id: 'bt16', name: 'Correct a Binary Tree', difficulty: 'Medium' },
      { id: 'bt17', name: 'Add One Row to Tree', difficulty: 'Medium' },
      { id: 'bt18', name: 'Longest Univalue Path', difficulty: 'Medium' },
      { id: 'bt19', name: 'Complete Binary Tree Inserter', difficulty: 'Medium' },
      { id: 'bt20', name: 'Check If a String Is a Valid Sequence from Root to Leaves Path in a Binary Tree', difficulty: 'Medium' },
      { id: 'bt21', name: 'Count Good Nodes in Binary Tree', difficulty: 'Medium' },
      { id: 'bt22', name: 'Find Leaves of Binary Tree', difficulty: 'Medium' },
      { id: 'bt23', name: 'Find Duplicate Subtrees', difficulty: 'Medium' },
      { id: 'bt24', name: 'Most Frequent Subtree Sum', difficulty: 'Medium' },
      { id: 'bt25', name: 'Maximum Difference Between Node and Ancestor', difficulty: 'Medium' },
      { id: 'bt26', name: 'All Nodes Distance K in Binary Tree', difficulty: 'Medium' },
      { id: 'bt27', name: 'Recover a Tree From Preorder Traversal', difficulty: 'Hard' },
      { id: 'bt28', name: 'Construct Binary Tree from Preorder and Postorder Traversal', difficulty: 'Medium' },
      { id: 'bt29', name: 'Maximum Product of Splitted Binary Tree', difficulty: 'Medium' },
      { id: 'bt30', name: 'Height of Binary Tree After Subtree Removal Queries', difficulty: 'Hard' }
    ],
    'BST': [
      { id: 'bst1', name: 'Convert Sorted Array to Binary Search Tree', difficulty: 'Easy' },
      { id: 'bst2', name: 'Validate Binary Search Tree', difficulty: 'Medium' },
      { id: 'bst3', name: 'Search in a Binary Search Tree', difficulty: 'Easy' },
      { id: 'bst4', name: 'Insert into a Binary Search Tree', difficulty: 'Medium' },
      { id: 'bst5', name: 'Delete Node in a BST', difficulty: 'Medium' },
      { id: 'bst6', name: 'Lowest Common Ancestor of a Binary Search Tree', difficulty: 'Easy' },
      { id: 'bst7', name: 'Kth Smallest Element in a BST', difficulty: 'Medium' },
      { id: 'bst8', name: 'Two Sum IV - Input is a BST', difficulty: 'Easy' },
      { id: 'bst9', name: 'Range Sum of BST', difficulty: 'Easy' },
      { id: 'bst10', name: 'Minimum Absolute Difference in BST', difficulty: 'Easy' },
      { id: 'bst11', name: 'Find Mode in Binary Search Tree', difficulty: 'Easy' },
      { id: 'bst12', name: 'BST Iterator', difficulty: 'Medium' },
      { id: 'bst13', name: 'Balance a Binary Search Tree', difficulty: 'Medium' },
      { id: 'bst14', name: 'Convert BST to Greater Tree', difficulty: 'Medium' },
      { id: 'bst15', name: 'Trim a Binary Search Tree', difficulty: 'Medium' },
      { id: 'bst16', name: 'Recover Binary Search Tree', difficulty: 'Medium' },
      { id: 'bst17', name: 'Construct Binary Search Tree from Preorder Traversal', difficulty: 'Medium' },
      { id: 'bst18', name: 'All Elements in Two Binary Search Trees', difficulty: 'Medium' },
      { id: 'bst19', name: 'Unique Binary Search Trees', difficulty: 'Medium' },
      { id: 'bst20', name: 'Unique Binary Search Trees II', difficulty: 'Medium' },
      { id: 'bst21', name: 'Increasing Order Search Tree', difficulty: 'Easy' },
      { id: 'bst22', name: 'Check if Array Is Preorder of Binary Search Tree', difficulty: 'Medium' },
      { id: 'bst23', name: 'Inorder Successor in BST', difficulty: 'Medium' },
      { id: 'bst24', name: 'Closest Binary Search Tree Value', difficulty: 'Easy' },
      { id: 'bst25', name: 'Closest Binary Search Tree Value II', difficulty: 'Hard' },
      { id: 'bst26', name: 'Split BST', difficulty: 'Medium' },
      { id: 'bst27', name: 'Verify Preorder Sequence in Binary Search Tree', difficulty: 'Medium' },
      { id: 'bst28', name: 'Largest BST Subtree', difficulty: 'Medium' },
      { id: 'bst29', name: 'Number of Ways to Reorder Array to Get Same BST', difficulty: 'Hard' },
      { id: 'bst30', name: 'Count Subtrees That Fit Game Rules', difficulty: 'Hard' }
    ],
    'Graphs': [
      { id: 'gr1', name: 'Number of Islands', difficulty: 'Medium' },
      { id: 'gr2', name: 'Clone Graph', difficulty: 'Medium' },
      { id: 'gr3', name: 'Course Schedule', difficulty: 'Medium' },
      { id: 'gr4', name: 'Word Ladder', difficulty: 'Hard' },
      { id: 'gr5', name: 'Find Center of Star Graph', difficulty: 'Easy' },
      { id: 'gr6', name: 'Find if Path Exists in Graph', difficulty: 'Easy' },
      { id: 'gr7', name: 'Keys and Rooms', difficulty: 'Medium' },
      { id: 'gr8', name: 'Network Delay Time', difficulty: 'Medium' },
      { id: 'gr9', name: 'Rotting Oranges', difficulty: 'Medium' },
      { id: 'gr10', name: 'Flood Fill', difficulty: 'Easy' },
      { id: 'gr11', name: 'Redundant Connection', difficulty: 'Medium' },
      { id: 'gr12', name: 'Is Graph Bipartite?', difficulty: 'Medium' },
      { id: 'gr13', name: 'Minimal Spanning Tree (Prim`s Algorithm)', difficulty: 'Medium' },
      { id: 'gr14', name: 'Shortest Path in Binary Matrix', difficulty: 'Medium' },
      { id: 'gr15', name: 'All Paths From Source to Target', difficulty: 'Medium' },
      { id: 'gr16', name: 'Number of Provinces', difficulty: 'Medium' },
      { id: 'gr17', name: 'Word Search', difficulty: 'Medium' },
      { id: 'gr18', name: 'Maximal Network Rank', difficulty: 'Medium' },
      { id: 'gr19', name: 'Reconstruct Itinerary', difficulty: 'Hard' },
      { id: 'gr20', name: 'Alien Dictionary', difficulty: 'Hard' },
      { id: 'gr21', name: 'Critical Connections in a Network', difficulty: 'Hard' },
      { id: 'gr22', name: 'Longest Increasing Path in a Matrix', difficulty: 'Hard' },
      { id: 'gr23', name: 'Path with Maximum Probability', difficulty: 'Medium' },
      { id: 'gr24', name: 'As Far from Land as Possible', difficulty: 'Medium' },
      { id: 'gr25', name: 'Loud and Rich', difficulty: 'Medium' },
      { id: 'gr26', name: 'Minimum Height Trees', difficulty: 'Medium' },
      { id: 'gr27', name: 'Possible Bipartition', difficulty: 'Medium' },
      { id: 'gr28', name: 'Satisfiability of Equality Equations', difficulty: 'Medium' },
      { id: 'gr29', name: 'Maximum Employee Invitations to a Meeting', difficulty: 'Hard' },
      { id: 'gr30', name: 'Shortest Path to Get All Keys', difficulty: 'Hard' }
    ],
    'Dynamic Programming': [
      { id: 'dp1', name: 'Climbing Stairs', difficulty: 'Easy' },
      { id: 'dp2', name: 'Coin Change', difficulty: 'Medium' },
      { id: 'dp3', name: 'Longest Common Subsequence', difficulty: 'Medium' },
      { id: 'dp4', name: 'Edit Distance', difficulty: 'Hard' },
      { id: 'dp5', name: 'House Robber', difficulty: 'Medium' },
      { id: 'dp6', name: 'Unique Paths', difficulty: 'Medium' },
      { id: 'dp7', name: 'Minimum Path Sum', difficulty: 'Medium' },
      { id: 'dp8', name: 'Partition Equal Subset Sum', difficulty: 'Medium' },
      { id: 'dp9', name: 'Longest Increasing Subsequence', difficulty: 'Medium' },
      { id: 'dp10', name: 'Word Break', difficulty: 'Medium' },
      { id: 'dp11', name: 'Decode Ways', difficulty: 'Medium' },
      { id: 'dp12', name: 'Maximal Square', difficulty: 'Medium' },
      { id: 'dp13', name: 'Ones and Zeroes', difficulty: 'Medium' },
      { id: 'dp14', name: 'Target Sum', difficulty: 'Medium' },
      { id: 'dp15', name: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium' },
      { id: 'dp16', name: 'Perfect Squares', difficulty: 'Medium' },
      { id: 'dp17', name: 'Integer Break', difficulty: 'Medium' },
      { id: 'dp18', name: 'Min Cost Climbing Stairs', difficulty: 'Easy' },
      { id: 'dp19', name: 'Fibonacci Number', difficulty: 'Easy' },
      { id: 'dp20', name: 'N-th Tribonacci Number', difficulty: 'Easy' },
      { id: 'dp21', name: 'Divisor Game', difficulty: 'Easy' },
      { id: 'dp22', name: 'Counting Bits', difficulty: 'Easy' },
      { id: 'dp23', name: 'Is Subsequence', difficulty: 'Easy' },
      { id: 'dp24', name: 'Trapping Rain Water', difficulty: 'Hard' },
      { id: 'dp25', name: 'Regular Expression Matching', difficulty: 'Hard' },
      { id: 'dp26', name: 'Wildcard Matching', difficulty: 'Hard' },
      { id: 'dp27', name: 'Maximum Subarray', difficulty: 'Medium' },
      { id: 'dp28', name: 'Unique Paths II', difficulty: 'Medium' },
      { id: 'dp29', name: 'Range Sum Query - 2D Immutable', difficulty: 'Medium' },
      { id: 'dp30', name: 'Dungeon Game', difficulty: 'Hard' }
    ],
    'Greedy': [
      { id: 'gy1', name: 'Assign Cookies', difficulty: 'Easy' },
      { id: 'gy2', name: 'Jump Game', difficulty: 'Medium' },
      { id: 'gy3', name: 'Gas Station', difficulty: 'Medium' },
      { id: 'gy4', name: 'Lemonade Change', difficulty: 'Easy' },
      { id: 'gy5', name: 'Can Place Flowers', difficulty: 'Easy' },
      { id: 'gy6', name: 'Minimum Subsequence in Non-Increasing Order', difficulty: 'Easy' },
      { id: 'gy7', name: 'Water Bottles', difficulty: 'Easy' },
      { id: 'gy8', name: 'Array Partition', difficulty: 'Easy' },
      { id: 'gy9', name: 'Queue Reconstruction by Height', difficulty: 'Medium' },
      { id: 'gy10', name: 'Task Scheduler', difficulty: 'Medium' },
      { id: 'gy11', name: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'Medium' },
      { id: 'gy12', name: 'Non-overlapping Intervals', difficulty: 'Medium' },
      { id: 'gy13', name: 'Partition Labels', difficulty: 'Medium' },
      { id: 'gy14', name: 'Jump Game II', difficulty: 'Medium' },
      { id: 'gy15', name: 'Candy', difficulty: 'Hard' },
      { id: 'gy16', name: 'Hand of Straights', difficulty: 'Medium' },
      { id: 'gy17', name: 'Bag of Tokens', difficulty: 'Medium' },
      { id: 'gy18', name: 'Boats to Save People', difficulty: 'Medium' },
      { id: 'gy19', name: 'Split a String in Balanced Strings', difficulty: 'Easy' },
      { id: 'gy20', name: 'Di String Match', difficulty: 'Easy' },
      { id: 'gy21', name: 'Best Time to Buy and Sell Stock II', difficulty: 'Medium' },
      { id: 'gy22', name: 'Merge Intervals', difficulty: 'Medium' },
      { id: 'gy23', name: 'Maximum Swap', difficulty: 'Medium' },
      { id: 'gy24', name: 'Wiggle Subsequence', difficulty: 'Medium' },
      { id: 'gy25', name: 'Remove K Digits', difficulty: 'Medium' },
      { id: 'gy26', name: 'Minimum Deletions to Make Character Frequencies Unique', difficulty: 'Medium' },
      { id: 'gy27', name: 'Smallest Range II', difficulty: 'Medium' },
      { id: 'gy28', name: 'Course Schedule III', difficulty: 'Hard' },
      { id: 'gy29', name: 'Patching Array', difficulty: 'Hard' },
      { id: 'gy30', name: 'Create Maximum Number', difficulty: 'Hard' }
    ],
    'Recursion': [
      { id: 'rec1', name: 'Fibonacci Number', difficulty: 'Easy' },
      { id: 'rec2', name: 'Pow(x, n)', difficulty: 'Medium' },
      { id: 'rec3', name: 'Merge Two Sorted Lists', difficulty: 'Easy' },
      { id: 'rec4', name: 'Reverse Linked List', difficulty: 'Easy' },
      { id: 'rec5', name: 'Search in a Binary Search Tree', difficulty: 'Easy' },
      { id: 'rec6', name: 'Range Sum of BST', difficulty: 'Easy' },
      { id: 'rec7', name: 'Invert Binary Tree', difficulty: 'Easy' },
      { id: 'rec8', name: 'Path Sum', difficulty: 'Easy' },
      { id: 'rec9', name: 'Same Tree', difficulty: 'Easy' },
      { id: 'rec10', name: 'Symmetric Tree', difficulty: 'Easy' },
      { id: 'rec11', name: 'Special Fibonacci', difficulty: 'Easy' },
      { id: 'rec12', name: 'Power of Three', difficulty: 'Easy' },
      { id: 'rec13', name: 'Power of Four', difficulty: 'Easy' },
      { id: 'rec14', name: 'Add Two Numbers', difficulty: 'Medium' },
      { id: 'rec15', name: 'Tower of Hanoi', difficulty: 'Medium' },
      { id: 'rec16', name: 'Josephus Problem', difficulty: 'Medium' },
      { id: 'rec17', name: 'Reverse Stack using Recursion', difficulty: 'Medium' },
      { id: 'rec18', name: 'Sort a Stack using Recursion', difficulty: 'Medium' },
      { id: 'rec19', name: 'K-th Symbol in Grammar', difficulty: 'Medium' },
      { id: 'rec20', name: 'Decode String', difficulty: 'Medium' },
      { id: 'rec21', name: 'Predict the Winner', difficulty: 'Medium' },
      { id: 'rec22', name: 'Parse Lisp Expression', difficulty: 'Hard' },
      { id: 'rec23', name: 'Basic Calculator', difficulty: 'Hard' },
      { id: 'rec24', name: 'Mini Parser', difficulty: 'Medium' },
      { id: 'rec25', name: 'Stamping The Sequence', difficulty: 'Hard' },
      { id: 'rec26', name: 'Flatten Nested List Iterator', difficulty: 'Medium' },
      { id: 'rec27', name: 'Find Kth Bit in Nth Binary String', difficulty: 'Medium' },
      { id: 'rec28', name: 'All Possible Full Binary Trees', difficulty: 'Medium' },
      { id: 'rec29', name: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium' },
      { id: 'rec30', name: 'Convert Sorted List to Binary Search Tree', difficulty: 'Medium' }
    ],
    'Backtracking': [
      { id: 'bk1', name: 'Subsets', difficulty: 'Medium' },
      { id: 'bk2', name: 'Permutations', difficulty: 'Medium' },
      { id: 'bk3', name: 'N-Queens', difficulty: 'Hard' },
      { id: 'bk4', name: 'Letter Combinations of a Phone Number', difficulty: 'Medium' },
      { id: 'bk5', name: 'Generate Parentheses', difficulty: 'Medium' },
      { id: 'bk6', name: 'Combination Sum', difficulty: 'Medium' },
      { id: 'bk7', name: 'Word Search', difficulty: 'Medium' },
      { id: 'bk8', name: 'Sudoku Solver', difficulty: 'Hard' },
      { id: 'bk9', name: 'Subsets II', difficulty: 'Medium' },
      { id: 'bk10', name: 'Permutations II', difficulty: 'Medium' },
      { id: 'bk11', name: 'Combination Sum II', difficulty: 'Medium' },
      { id: 'bk12', name: 'Combination Sum III', difficulty: 'Medium' },
      { id: 'bk13', name: 'Palindrome Partitioning', difficulty: 'Medium' },
      { id: 'bk14', name: 'Restore IP Addresses', difficulty: 'Medium' },
      { id: 'bk15', name: 'N-Queens II', difficulty: 'Hard' },
      { id: 'bk16', name: 'Word Search II', difficulty: 'Hard' },
      { id: 'bk17', name: 'Expression Add Operators', difficulty: 'Hard' },
      { id: 'bk18', name: 'Binary Watch', difficulty: 'Easy' },
      { id: 'bk19', name: 'Path with Maximum Gold', difficulty: 'Medium' },
      { id: 'bk20', name: 'Beautiful Arrangement', difficulty: 'Medium' },
      { id: 'bk21', name: 'Split a String Into the Max Number of Unique Substrings', difficulty: 'Medium' },
      { id: 'bk22', name: 'Matchsticks to Square', difficulty: 'Medium' },
      { id: 'bk23', name: 'Fair Distribution of Cookies', difficulty: 'Medium' },
      { id: 'bk24', name: 'Letter Case Permutation', difficulty: 'Medium' },
      { id: 'bk25', name: 'Target Sum', difficulty: 'Medium' },
      { id: 'bk26', name: 'Iterator for Combination', difficulty: 'Medium' },
      { id: 'bk27', name: 'Non-decreasing Subsequences', difficulty: 'Medium' },
      { id: 'bk28', name: 'IP Address Combinations', difficulty: 'Medium' },
      { id: 'bk29', name: 'Word Ladder II', difficulty: 'Hard' },
      { id: 'bk30', name: 'Verbal Arithmetic Puzzle', difficulty: 'Hard' }
    ]
  };

  const fetchDsaProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dsa/progress');
      if (res.data.success) {
        setProgressList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to retrieve DSA logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDsaProgress();
  }, []);

  const handleToggle = async (topic, problemName, difficulty, currentCompleted) => {
    const key = `${topic}-${problemName}`;
    try {
      setToggling(key);
      const res = await api.post('/dsa/progress', {
        topic,
        problemName,
        difficulty,
        completed: !currentCompleted,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchDsaProgress();
        refreshProfile();
      }
    } catch (err) {
      console.error('Failed to modify DSA progress:', err);
      toast.error('Could not modify completion status.');
    } finally {
      setToggling(null);
    }
  };

  const isCompleted = (topic, problemName) => {
    return progressList.some(
      (p) => p.topic === topic && p.problemName === problemName && p.completed
    );
  };

  const getDiffColor = (diff) => {
    if (diff === 'Easy') return 'text-emerald-500 bg-emerald-550/10';
    if (diff === 'Medium') return 'text-amber-500 bg-amber-550/10';
    return 'text-rose-500 bg-rose-550/10';
  };

  const getCompletionPercentage = (topic) => {
    const categoryProblems = problemsBank[topic] || [];
    if (categoryProblems.length === 0) return 0;
    
    const completedCount = categoryProblems.filter((p) =>
      isCompleted(topic, p.name)
    ).length;

    return Math.round((completedCount / categoryProblems.length) * 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header and Streaks */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-200/50 dark:border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">DSA Practice & Streaks</h1>
          <p className="text-slate-400 text-xs font-light">
            Stay consistent. Practice essential conceptual coding templates across 13 core categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-card-dark border border-slate-200/60 dark:border-white/5 text-xs font-bold shadow-sm">
            <Flame className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-250">{user?.dsaStreak || 0} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-450">
            <Code className="w-4.5 h-4.5" />
            <span>{progressList.length} Solved</span>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
              filterDifficulty === diff
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {diff} Problems
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Object.keys(problemsBank).map((topic) => {
            const allProblems = problemsBank[topic];
            const filteredProblems =
              filterDifficulty === 'All'
                ? allProblems
                : allProblems.filter((p) => p.difficulty === filterDifficulty);

            if (filteredProblems.length === 0) return null;

            const completionRate = getCompletionPercentage(topic);

            return (
              <motion.div 
                key={topic} 
                variants={itemVariants}
                className="glass-card p-6 bg-white dark:bg-card-dark border-slate-200/50 dark:border-white/5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent blur-2xl pointer-events-none"></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-white/5">
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-205">{topic}</h3>
                    <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {completionRate}%
                    </span>
                  </div>

                  {/* Problems list */}
                  <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
                    {filteredProblems.map((prob) => {
                      const completed = isCompleted(topic, prob.name);
                      const key = `${topic}-${prob.name}`;
                      const isToggling = toggling === key;

                      return (
                        <div
                          key={prob.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 dark:bg-bg-dark/40 border border-slate-100 dark:border-white/5 hover:border-indigo-500/10 transition-colors"
                        >
                          <button
                            onClick={() =>
                              handleToggle(topic, prob.name, prob.difficulty, completed)
                            }
                            disabled={toggling !== null}
                            className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300"
                          >
                            {isToggling ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                            ) : completed ? (
                              <CheckSquare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0" />
                            )}
                            <span className="text-[11px] font-medium text-left line-clamp-1">{prob.name}</span>
                          </button>

                          <span
                            className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${getDiffColor(
                              prob.difficulty
                            )}`}
                          >
                            {prob.difficulty}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-slate-150 dark:bg-bg-dark/50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default DsaPractice;
