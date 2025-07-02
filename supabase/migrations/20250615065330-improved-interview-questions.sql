-- Enhanced Interview Questions Migration
-- This migration replaces and expands the existing interview questions with more comprehensive, technical, and industry-relevant questions

-- First, clear existing questions to avoid duplicates
DELETE FROM public.interview_questions;

-- Insert comprehensive interview questions organized by difficulty and type
INSERT INTO public.interview_questions (question_text, industry, difficulty_level, question_type, tags, expected_answer_framework) VALUES

-- ===== FRONTEND ENGINEERING QUESTIONS =====

-- Level 1: Basic Technical Knowledge
('Can you explain the difference between HTML, CSS, and JavaScript and how they work together in web development?', 'frontend', 1, 'technical', ARRAY['html', 'css', 'javascript', 'fundamentals'], 'Technical explanation with examples'),
('What is the DOM and how do you manipulate it using JavaScript?', 'frontend', 1, 'technical', ARRAY['dom', 'javascript', 'manipulation'], 'Technical explanation with code examples'),
('Explain the difference between let, const, and var in JavaScript. When would you use each?', 'frontend', 1, 'technical', ARRAY['javascript', 'variables', 'scope'], 'Technical explanation with use cases'),
('What is responsive design and how do you implement it?', 'frontend', 1, 'technical', ARRAY['responsive-design', 'css', 'mobile-first'], 'Technical explanation with implementation details'),

-- Level 2: Intermediate Technical Skills
('How does React work under the hood? Explain the virtual DOM concept.', 'frontend', 2, 'technical', ARRAY['react', 'virtual-dom', 'performance'], 'Technical deep-dive with architecture explanation'),
('What are React hooks and how do they differ from class components?', 'frontend', 2, 'technical', ARRAY['react', 'hooks', 'functional-components'], 'Technical comparison with code examples'),
('Explain the concept of state management in React applications. When would you use Context API vs Redux?', 'frontend', 2, 'technical', ARRAY['react', 'state-management', 'context-api', 'redux'], 'Technical comparison with decision criteria'),
('How do you handle asynchronous operations in JavaScript? Explain promises, async/await, and callbacks.', 'frontend', 2, 'technical', ARRAY['javascript', 'async', 'promises', 'callbacks'], 'Technical explanation with code examples'),

-- Level 3: Advanced Technical Concepts
('Describe how you would optimize the performance of a React application. What tools and techniques would you use?', 'frontend', 3, 'technical', ARRAY['react', 'performance', 'optimization', 'tools'], 'Technical approach with specific strategies'),
('How would you implement a custom hook for handling API calls with loading states and error handling?', 'frontend', 3, 'technical', ARRAY['react', 'custom-hooks', 'api', 'error-handling'], 'Code implementation with best practices'),
('Explain the concept of code splitting in React. How would you implement it and what are the benefits?', 'frontend', 3, 'technical', ARRAY['react', 'code-splitting', 'lazy-loading', 'performance'], 'Technical implementation with benefits'),
('How do you handle browser compatibility issues? What strategies do you use for cross-browser testing?', 'frontend', 3, 'technical', ARRAY['browser-compatibility', 'testing', 'polyfills'], 'Technical strategies with tools'),

-- Level 4: Expert Level Technical
('Design a state management solution for a large-scale React application with multiple teams working on different features.', 'frontend', 4, 'technical', ARRAY['react', 'state-management', 'architecture', 'scalability'], 'System design with architecture patterns'),
('How would you implement a real-time collaborative feature like Google Docs using WebSockets and React?', 'frontend', 4, 'technical', ARRAY['websockets', 'real-time', 'collaboration', 'react'], 'System design with technical implementation'),
('Explain how you would implement a custom rendering engine for a component library that supports multiple frameworks.', 'frontend', 4, 'technical', ARRAY['component-library', 'rendering', 'architecture', 'frameworks'], 'System design with technical architecture'),

-- Level 5: Leadership and Architecture
('As a senior frontend engineer, how would you lead the migration of a legacy jQuery application to a modern React architecture?', 'frontend', 5, 'technical', ARRAY['migration', 'legacy', 'react', 'leadership'], 'Leadership approach with technical strategy'),
('Design a micro-frontend architecture for a large e-commerce platform with multiple teams and technologies.', 'frontend', 5, 'technical', ARRAY['micro-frontends', 'architecture', 'e-commerce', 'leadership'], 'System design with team coordination'),

-- ===== BEHAVIORAL QUESTIONS =====

-- Level 1: Basic Behavioral
('Tell me about yourself and your journey into frontend development.', 'general', 1, 'behavioral', ARRAY['introduction', 'background', 'motivation'], 'Personal story with career progression'),
('What interests you about frontend development and why did you choose this career path?', 'general', 1, 'behavioral', ARRAY['motivation', 'career-choice', 'passion'], 'Personal motivation with examples'),
('Describe a project you worked on that you are particularly proud of.', 'general', 1, 'behavioral', ARRAY['achievement', 'project', 'pride'], 'STAR method with technical details'),

-- Level 2: Intermediate Behavioral
('Tell me about a time when you had to learn a new technology quickly for a project. How did you approach it?', 'general', 2, 'behavioral', ARRAY['learning', 'adaptability', 'problem-solving'], 'STAR method with learning strategy'),
('Describe a situation where you had to work with a difficult team member or stakeholder. How did you handle it?', 'general', 2, 'behavioral', ARRAY['teamwork', 'conflict-resolution', 'communication'], 'STAR method with resolution approach'),
('How do you handle tight deadlines and pressure? Give me a specific example.', 'general', 2, 'behavioral', ARRAY['stress-management', 'time-management', 'prioritization'], 'STAR method with coping strategies'),

-- Level 3: Advanced Behavioral
('Tell me about a time when you had to make a difficult technical decision that affected the entire team. How did you approach it?', 'general', 3, 'behavioral', ARRAY['decision-making', 'leadership', 'technical-judgment'], 'STAR method with decision framework'),
('Describe a situation where you had to mentor or teach a junior developer. What was your approach?', 'general', 3, 'behavioral', ARRAY['mentoring', 'leadership', 'knowledge-sharing'], 'STAR method with teaching methodology'),
('Tell me about a time when you failed at something technical. What did you learn from it?', 'general', 3, 'behavioral', ARRAY['failure', 'learning', 'growth-mindset'], 'STAR method with lessons learned'),

-- Level 4: Leadership Behavioral
('Describe a situation where you had to lead a team through a major technical challenge or crisis.', 'general', 4, 'behavioral', ARRAY['leadership', 'crisis-management', 'team-coordination'], 'STAR method with leadership approach'),
('Tell me about a time when you had to influence stakeholders to adopt a new technology or approach.', 'general', 4, 'behavioral', ARRAY['influence', 'stakeholder-management', 'change-management'], 'STAR method with influence strategy'),

-- Level 5: Strategic Behavioral
('As a senior engineer, how would you approach building a frontend team from scratch?', 'general', 5, 'behavioral', ARRAY['team-building', 'leadership', 'strategy'], 'Strategic approach with team development'),
('Describe how you would handle a situation where your technical recommendation conflicts with business priorities.', 'general', 5, 'behavioral', ARRAY['business-acumen', 'technical-leadership', 'compromise'], 'Strategic thinking with business understanding'),

-- ===== SITUATIONAL QUESTIONS =====

-- Level 2: Problem-Solving Scenarios
('A user reports that your React application is very slow on mobile devices. How would you investigate and fix this issue?', 'frontend', 2, 'situational', ARRAY['performance', 'debugging', 'mobile', 'problem-solving'], 'Systematic approach with tools and techniques'),
('Your team is debating whether to use a UI library like Material-UI or build custom components. How would you approach this decision?', 'frontend', 2, 'situational', ARRAY['decision-making', 'ui-libraries', 'team-collaboration'], 'Decision framework with pros and cons'),

-- Level 3: Complex Scenarios
('You discover a critical security vulnerability in your frontend code that could expose user data. How do you handle this situation?', 'frontend', 3, 'situational', ARRAY['security', 'crisis-management', 'risk-assessment'], 'Crisis response with security protocols'),
('Your application needs to support users with disabilities. How would you approach implementing accessibility features?', 'frontend', 3, 'situational', ARRAY['accessibility', 'inclusive-design', 'compliance'], 'Comprehensive approach with standards'),

-- Level 4: Strategic Scenarios
('Your company wants to implement a design system across multiple products. How would you approach this as a senior frontend engineer?', 'frontend', 4, 'situational', ARRAY['design-systems', 'architecture', 'cross-team-collaboration'], 'Strategic approach with implementation plan'),
('You need to migrate a large application from Angular to React while maintaining zero downtime. How would you plan this migration?', 'frontend', 4, 'situational', ARRAY['migration', 'zero-downtime', 'planning', 'risk-management'], 'Strategic planning with risk mitigation'),

-- ===== MODERN INDUSTRY QUESTIONS =====

-- Level 2: Modern Technologies
('What are your thoughts on TypeScript vs JavaScript? When would you choose one over the other?', 'frontend', 2, 'technical', ARRAY['typescript', 'javascript', 'type-safety', 'modern-development'], 'Technical comparison with use cases'),
('How familiar are you with modern CSS features like Grid, Flexbox, and CSS Custom Properties?', 'frontend', 2, 'technical', ARRAY['css', 'grid', 'flexbox', 'custom-properties'], 'Technical knowledge with practical examples'),

-- Level 3: Modern Development Practices
('How do you approach testing in React applications? What testing strategies and tools do you use?', 'frontend', 3, 'technical', ARRAY['testing', 'react', 'jest', 'cypress', 'testing-strategy'], 'Comprehensive testing approach with tools'),
('What is your experience with modern build tools like Webpack, Vite, or esbuild? How do you optimize build performance?', 'frontend', 3, 'technical', ARRAY['build-tools', 'webpack', 'vite', 'performance'], 'Technical knowledge with optimization strategies'),

-- Level 4: Advanced Modern Concepts
('How would you implement a Progressive Web App (PWA) with offline functionality and push notifications?', 'frontend', 4, 'technical', ARRAY['pwa', 'service-workers', 'offline', 'push-notifications'], 'Technical implementation with best practices'),
('Explain how you would implement a real-time dashboard with WebSocket connections and data visualization.', 'frontend', 4, 'technical', ARRAY['websockets', 'real-time', 'data-visualization', 'dashboards'], 'Technical architecture with implementation'),

-- ===== SYSTEM DESIGN QUESTIONS =====

-- Level 3: Component Design
('Design a reusable form component that handles validation, error states, and accessibility requirements.', 'frontend', 3, 'system-design', ARRAY['component-design', 'forms', 'validation', 'accessibility'], 'Component architecture with implementation details'),
('How would you design a notification system that supports different types of notifications and user preferences?', 'frontend', 3, 'system-design', ARRAY['notification-system', 'user-preferences', 'component-architecture'], 'System design with user experience'),

-- Level 4: Application Architecture
('Design a state management solution for a complex e-commerce application with shopping cart, user preferences, and real-time inventory.', 'frontend', 4, 'system-design', ARRAY['state-management', 'e-commerce', 'real-time', 'architecture'], 'System architecture with data flow'),
('How would you design a component library that supports theming, internationalization, and multiple design systems?', 'frontend', 4, 'system-design', ARRAY['component-library', 'theming', 'i18n', 'design-systems'], 'Library architecture with extensibility'),

-- Level 5: Enterprise Architecture
('Design a micro-frontend architecture for a large financial application with strict security requirements and multiple teams.', 'frontend', 5, 'system-design', ARRAY['micro-frontends', 'security', 'enterprise', 'team-coordination'], 'Enterprise architecture with security considerations'),
('How would you design a frontend architecture that supports A/B testing, feature flags, and gradual rollouts?', 'frontend', 5, 'system-design', ARRAY['feature-flags', 'a-b-testing', 'gradual-rollouts', 'architecture'], 'Advanced architecture with experimentation support');

-- Insert enhanced feedback templates
INSERT INTO public.feedback_templates (category, score_range, positive_feedback, improvement_suggestions, follow_up_questions) VALUES

-- Technical Skills Feedback
('technical-skills', '4-5', 
 ARRAY['Excellent technical knowledge and depth', 'Strong understanding of modern frontend technologies', 'Demonstrates advanced problem-solving skills', 'Shows mastery of best practices'],
 ARRAY['Continue staying updated with latest technologies', 'Consider contributing to open source projects'],
 ARRAY['How do you stay current with frontend trends?', 'What technical challenges interest you most?']),

('technical-skills', '3-4', 
 ARRAY['Good technical foundation', 'Shows understanding of core concepts', 'Demonstrates practical problem-solving'],
 ARRAY['Deepen knowledge in specific areas', 'Practice with more complex scenarios', 'Focus on system design skills'],
 ARRAY['What areas would you like to improve technically?', 'How do you approach learning new technologies?']),

('technical-skills', '2-3', 
 ARRAY['Basic technical understanding present', 'Shows willingness to learn'],
 ARRAY['Strengthen fundamentals', 'Practice coding regularly', 'Work on real projects', 'Study modern frameworks'],
 ARRAY['What resources do you use for learning?', 'How much time do you spend coding outside work?']),

-- Communication Skills Feedback
('communication', '4-5', 
 ARRAY['Clear and articulate communication', 'Excellent technical storytelling', 'Strong ability to explain complex concepts', 'Professional presentation'],
 ARRAY['Continue practicing with different audiences', 'Consider mentoring others'],
 ARRAY['How do you explain technical concepts to non-technical stakeholders?', 'What communication challenges have you faced?']),

('communication', '3-4', 
 ARRAY['Good communication skills', 'Clear explanations', 'Professional demeanor'],
 ARRAY['Practice explaining complex topics simply', 'Work on confidence in technical discussions', 'Improve storytelling with examples'],
 ARRAY['How do you handle technical disagreements?', 'What communication style works best for you?']),

-- Problem-Solving Feedback
('problem-solving', '4-5', 
 ARRAY['Excellent analytical thinking', 'Creative problem-solving approach', 'Strong systematic methodology', 'Considers multiple solutions'],
 ARRAY['Continue challenging yourself with complex problems', 'Share your problem-solving approaches with others'],
 ARRAY['What was your most challenging technical problem?', 'How do you approach debugging complex issues?']),

('problem-solving', '3-4', 
 ARRAY['Good problem-solving approach', 'Logical thinking', 'Shows systematic methodology'],
 ARRAY['Practice with more complex scenarios', 'Consider edge cases more thoroughly', 'Improve debugging skills'],
 ARRAY['How do you approach unfamiliar technical challenges?', 'What debugging tools do you prefer?']),

-- Leadership Feedback
('leadership', '4-5', 
 ARRAY['Strong leadership potential', 'Excellent team collaboration', 'Shows initiative and drive', 'Demonstrates mentoring abilities'],
 ARRAY['Continue developing leadership skills', 'Consider taking on more team responsibilities'],
 ARRAY['How do you motivate team members?', 'What leadership challenges have you faced?']),

('leadership', '3-4', 
 ARRAY['Shows leadership potential', 'Good team collaboration', 'Demonstrates initiative'],
 ARRAY['Take on more leadership opportunities', 'Practice mentoring junior developers', 'Improve decision-making confidence'],
 ARRAY['How do you handle team conflicts?', 'What leadership opportunities interest you?']),

-- Adaptability Feedback
('adaptability', '4-5', 
 ARRAY['Excellent adaptability to change', 'Quick learner', 'Embraces new technologies', 'Shows resilience'],
 ARRAY['Continue embracing new challenges', 'Share your learning strategies with others'],
 ARRAY['How do you handle major technology changes?', 'What was your biggest learning curve?']),

('adaptability', '3-4', 
 ARRAY['Good adaptability', 'Shows willingness to learn', 'Handles change well'],
 ARRAY['Practice with more diverse technologies', 'Improve learning speed', 'Embrace more challenging projects'],
 ARRAY['How do you approach learning new frameworks?', 'What motivates you to learn new technologies?']); 