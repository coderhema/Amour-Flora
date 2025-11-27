import { LetterCategory, LetterTemplate } from '../types';

export const LETTER_TEMPLATES: LetterTemplate[] = [
  // Personal
  {
    id: 'p1',
    category: LetterCategory.PERSONAL,
    title: 'Love Note',
    content: "My Dearest [Name],\n\nEvery moment with you feels like a beautiful dream I never want to wake up from. Your laughter is my favorite melody, and your smile lights up my darkest days. I just wanted to remind you how deeply and madly I am in love with you.\n\nForever yours,\n[Your Name]"
  },
  {
    id: 'p2',
    category: LetterCategory.PERSONAL,
    title: 'Birthday Wish',
    content: "Happy Birthday [Name]!\n\nAs you celebrate another year of your wonderful journey, I hope you take a moment to realize how much joy you bring to everyone around you. May this year be filled with unexpected adventures, boundless happiness, and all the cake you can eat.\n\nWarmest wishes,\n[Your Name]"
  },
  {
    id: 'p3',
    category: LetterCategory.PERSONAL,
    title: 'Sincere Apology',
    content: "Dear [Name],\n\nI am writing this with a heavy heart to sincerely apologize for my actions. I value our relationship more than words can express, and I am truly sorry for hurting you. I hope you can find it in your heart to forgive me.\n\nSincerely,\n[Your Name]"
  },
  {
    id: 'p4',
    category: LetterCategory.PERSONAL,
    title: 'Thinking of You',
    content: "Hi [Name],\n\nIt's been too long since we last spoke, but I wanted you to know that you've been on my mind. I hope life is treating you kindly and that we can catch up soon. Miss you!\n\nBest,\n[Your Name]"
  },

  // Professional
  {
    id: 'pr1',
    category: LetterCategory.PROFESSIONAL,
    title: 'Cover Letter',
    content: "Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the [Position Name] role at [Company Name]. With my background in [Your Field] and a passion for [Specific Interest], I am confident in my ability to contribute meaningfully to your team. I admire [Company Name]'s commitment to innovation and would be honored to bring my skills to your projects.\n\nSincerely,\n[Your Name]"
  },
  {
    id: 'pr2',
    category: LetterCategory.PROFESSIONAL,
    title: 'Resignation',
    content: "Dear [Manager Name],\n\nPlease accept this letter as formal notification that I am resigning from my position as [Position Name]. My last day will be [Date].\n\nI want to thank you for the opportunity to have worked at [Company Name] for the past [Duration]. I have learned a great deal and grown professionally during my time here. I wish the company continued success.\n\nSincerely,\n[Your Name]"
  },
  {
    id: 'pr3',
    category: LetterCategory.PROFESSIONAL,
    title: 'Recommendation Request',
    content: "Dear [Name],\n\nI hope this email finds you well. I am currently in the process of applying for [Opportunity] and was wondering if you would be willing to write a letter of recommendation on my behalf. I have always valued your mentorship and believe your perspective on my work would be incredibly impactful.\n\nThank you for considering my request.\n\nBest regards,\n[Your Name]"
  },

  // Formal
  {
    id: 'f1',
    category: LetterCategory.FORMAL,
    title: 'Event Invitation',
    content: "Dear [Name],\n\nWe cordially invite you to attend [Event Name], a celebration of [Occasion].\n\nThe event will take place on [Date] at [Time] at [Venue Address].\n\nWe would be honored by your presence on this special occasion. Please RSVP by [Date].\n\nSincerely,\n[Host Name]"
  },
  {
    id: 'f2',
    category: LetterCategory.FORMAL,
    title: 'Condolence',
    content: "Dear [Name],\n\nI was deeply saddened to hear about the passing of [Deceased's Name]. Please accept my heartfelt condolences during this difficult time. My thoughts are with you and your family.\n\nWith sympathy,\n[Your Name]"
  },
  {
    id: 'f3',
    category: LetterCategory.FORMAL,
    title: 'Appreciation',
    content: "Dear [Name],\n\nI am writing to formally express my gratitude for your generous support regarding [Subject]. Your assistance was invaluable and greatly appreciated. Thank you for your kindness and professionalism.\n\nRespectfully,\n[Your Name]"
  }
];